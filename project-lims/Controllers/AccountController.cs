

using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

using System.Collections;
using System.Collections.Generic;

using System.Security;
using System.Security.Claims;

using Microsoft.AspNetCore.Authentication;

using Microsoft.AspNetCore.Identity;

using Lims.Models;


public class Credentials
{
    public string UserName { get; set; }
    public string Password { get; set; }
}

[Route("/[controller]/[action]")]
public class AccountController : Controller
{
    private readonly ILogger _log;
    private readonly UserManager<LimsUser> userMgr;
    private readonly SignInManager<LimsUser> signinMgr;

    public AccountController( ILoggerFactory logger, UserManager<LimsUser> userMgr, SignInManager<LimsUser> signinMgr )
    {
        _log = logger.CreateLogger("AccountController");
        this.userMgr = userMgr;
        this.signinMgr = signinMgr;
    }

    [HttpGet]
    public IActionResult Login()
    {
        _log.LogWarning($"Account/Login User: {HttpContext.User.Identity.Name}");
        return View();
    }

    [HttpPost]
    [Route("/[controller]/[action]/{username?}/{password?}")]
    public async Task<IActionResult> Login(string userName, string password, bool rememberMe)
    {
        //no need for this step because SignInManager Automatically calls HttpContext.SignInAsync()
        //see https://github.com/aspnet/Identity/blob/de3e6e08b43ee995f3a247c502fc88c1458f3ced/src/Identity/SignInManager.cs#L744
        //you manually use HttpContext.SignInAsync() if you are creating your own authentication mechanism
        #region without Microsoft.AspNetCore.Identity
        // List<Claim> claims = new List<Claim>() {
        //     new Claim(ClaimTypes.Name, userName),
        //     new Claim(ClaimTypes.Role, "admin")
        // };

        // string scheme = Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme;

        // ClaimsIdentity claimIden = new System.Security.Claims.ClaimsIdentity(claims, scheme, ClaimTypes.Name, ClaimTypes.Role);
        // ClaimsPrincipal claimsPrinc = new ClaimsPrincipal(claimIden);

        // Microsoft.AspNetCore.Authentication.AuthenticationProperties authProps = new Microsoft.AspNetCore.Authentication.AuthenticationProperties {
        //     //RedirectUri = "",
        //     IsPersistent = true
        // };
        //HttpContext.SignInAsync(scheme, claimsPrinc, authProps);
        #endregion

        try
        {
            var user = await userMgr.FindByNameAsync(userName);
            if(user == null)
                throw new Exception("No User");

            var result = await signinMgr.PasswordSignInAsync( user, password, true, false );

            if(!result.Succeeded)
            {
                ViewData["Failed"] = "password verification failed";
                return View("Login");
            }
        }
        catch(Exception ex)
        {
            _log.LogError(ex.Message);    
            ViewData["Failed"] = ex.Message;
            return View("Login");
        }

        return RedirectToAction("Index", "Samples");
    }

    [Route("/[controller]/[action]/{username}/{password}")]
    public async Task<IActionResult> LoginAsync(string username, string password)
    {
        List<Claim> claims = new List<Claim>() {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, "admin")
        };

        string scheme = Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme;

        ClaimsIdentity claimIden = new System.Security.Claims.ClaimsIdentity(claims, scheme, ClaimTypes.Name, ClaimTypes.Role);
        ClaimsPrincipal claimsPrinc = new ClaimsPrincipal(claimIden);

        Microsoft.AspNetCore.Authentication.AuthenticationProperties authProps = new Microsoft.AspNetCore.Authentication.AuthenticationProperties {
            //RedirectUri = "",
            IsPersistent = true
        };

        _log.LogWarning($"Logging In User: {username}");

        await HttpContext.SignInAsync(scheme, claimsPrinc);

        return Json("ok");
    }
}