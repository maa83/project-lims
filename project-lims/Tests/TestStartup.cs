
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using System.Threading.Tasks;
using System.Security.Claims;
using System;

using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Identity;

namespace Lims
{
    public static class TestMiddlewareExtensions
    {
        public static void AddTestServices(this IServiceCollection services)
        {
            services.AddSingleton<Microsoft.AspNetCore.Authorization.IAuthorizationHandler, TestPolicyHandler>();
            services.AddSingleton<Microsoft.AspNetCore.Authorization.IAuthorizationHandler, TestMultiplePolicyHandler>();
            
            //services.AddTransient<Cryptography>( provider => { return new Cryptography(DateTime.Now.Millisecond, 128); } );
            //services.AddTransient<Cryptography>();
            //services.AddScoped<DbContext, IdentityContext>( provider => { return new IdentityContext(provider); } );

            services.AddAuthorization(options => {
                // options.AddPolicy("MustBeMOA995", policy => {
                //     policy.AddRequirements(new TestPolicyRequirement("moa995"));
                // });
            });
            services.Configure<Microsoft.AspNetCore.Authorization.AuthorizationOptions>( options => {
                options.AddPolicy("MustBeMOA995", policy => {
                    policy.Requirements.Add(new TestPolicyRequirement("moa995"));
                });
                options.AddPolicy("MustBeAuthenticated", policy => {
                    policy.RequireAuthenticatedUser();
                });
                options.AddPolicy("MustHaveAdminClaim", policy => {
                    policy.RequireClaim(ClaimTypes.Role , "admin");
                } );
                options.AddPolicy("MustHaveMOA995Claim", policy => {
                    policy.RequireClaim(ClaimTypes.Name , "moa995");
                } );
            } );

            //services.AddMvc().AddMvcOptions(opt => { opt.RequireHttpsPermanent = true; });
            
            // services.AddMvcCore( options => {
            //     options.Filters.Add<TestActionFilter>(); 
            //     options.Filters.Add<TestAuthorizationFilter>();
            // } ).AddViews().AddJsonFormatters().AddRazorPages().AddRazorViewEngine();


            services.AddMvcCore().AddViews().AddJsonFormatters().AddRazorPages().AddRazorViewEngine().AddAuthorization();
            services.Configure<Microsoft.AspNetCore.Mvc.MvcOptions>( options => { 
                options.Filters.Add<TestActionFilter>(); 
                options.Filters.Add<TestAuthorizationFilter>();
                //options.RequireHttpsPermanent = true;
            });

            services.AddSingleton<IdentityContext>( provider => 
            { 
                var db = new IdentityContext();
                db.Database.EnsureCreated();
                return db; 
            } );
            // services.AddIdentity<TestUserIdentity, IdentityRole>( options => {
            //     options.Lockout.MaxFailedAccessAttempts = 3;
            // } ).AddUserStore<TestUserStore>().AddUserValidator<TestUserValidator>();
            services.AddTransient<IPasswordHasher<TestUserIdentity>, PasswordHasher<TestUserIdentity>>();
            services.AddTransient<TestUserStore>( provider => { 
                return new TestUserStore( provider.GetService<IdentityContext>()); 
            } );
            services.AddScoped<PasswordValidator<TestUserIdentity>>();
            services.AddIdentityCore<TestUserIdentity>( config => {
                config.Lockout.MaxFailedAccessAttempts = 3;
            } ).AddUserStore<TestUserStore>();

            //services.AddTransient<TestUserValidator>();
            //services.AddTransient<TestUserStore>( provider => { return new TestUserStore(provider.GetService<IdentityContext>()); } );

            // services.Configure<IdentityOptions>( options => {
            //     options.Lockout.MaxFailedAccessAttempts = 3;
            // } );
        }

        public static void AddTestMiddleware(this IApplicationBuilder app)
        {
            //Microsoft.AspNetCore.Http.HttpContext httpContext
            //System.Func<System.Threading.Tasks.Task>

            app.Use( async (context, next) => {
                // do something before
                context.Response.Headers.Add("x-middleware", "yellow");
                if(next != null)
                    await next();
                //context.Response.Headers.Add("x-middleware-after", "yellow again");
                //do something after
            } );

            app.Use( (httpContext, next) => {
                //do something before
                Task work = Task.CompletedTask;
                if(next != null)
                    work = next();
                //do something after

                return work;
            } );

            app.UseMvc( options => {
                /*
                Route parameter names must be non-empty and cannot contain these characters: '{', '}', '/'.
                The '?' character marks a parameter as optional, and can occur only at the end of the parameter.
                The '*' character marks a parameter as catch-all, and can occur only at the start of the parameter.
                */
                options
                .MapRoute(
                    name: "default", 
                    template: "{controller}/{action}/",
                    defaults: new { controller = "Test", action = "Index" }
                )
                .MapRoute(
                    name: "auth", 
                    template: "{controller}/{action}/{userName?}/{password?}",
                    defaults: new { controller = "Test", action = "ValidateUser" }
                );
                // .MapRoute(
                //     name: "shortcuts", 
                //     template: "{action}/",
                //     defaults: new { controller = "Test", action = "TestAction" }
                // )
                // .MapRoute(
                //     name: "authshort", 
                //     template: "{action}/{userName?}/{password?}",
                //     defaults: new { controller = "Test", action = "TestAction" }
                // )
                // .MapRoute(
                //     name: "capture_all", 
                //     template: "{*url}", 
                //     defaults: new { controller = "Test", action = "CaptureAllAction" }
                // );
            });

            //executes at the end of the pipeline
            
            // app.Run( async ctx => {

            //     byte[] buffer = System.Text.ASCIIEncoding.UTF8.GetBytes("Yellow World");
            //     await ctx.Response.Body.WriteAsync(buffer, 0, buffer.Length);

            // });
        }
    }
}