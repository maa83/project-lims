using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Routing.Constraints;

using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.Authentication;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.Identity;

using AutoMapper;

using Lims.Models;
using Lims.Managers;
using Lims.BaseModels;
using Lims.ViewModels;
using Lims.TransferModels;

namespace Lims
{
    public class CustomModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            return Task.CompletedTask;
        }
    }
    
    public class CustomExceptionFilterAttribute : ExceptionFilterAttribute
    {
        // private ILogger logger;
        public CustomExceptionFilterAttribute()
        {
            // this.logger = provider.GetService<ILoggerFactory>().CreateLogger("Exception Logger");
        }

        public override void OnException(ExceptionContext context)
        {
            string exceptionType = context.Exception.GetType().Name, exceptionMessage = context.Exception.Message;
            // logger.LogError($"Type: {exceptionType}: , Message: {exceptionMessage}");
            context.Result = new JsonResult($"Exception: {exceptionMessage}") { StatusCode = StatusCodes.Status500InternalServerError };
        }

        public override Task OnExceptionAsync(ExceptionContext context)
        {
            string exceptionType = context.Exception.GetType().Name, exceptionMessage = context.Exception.Message;
            context.Result = new JsonResult($"Exception: {exceptionMessage}") { StatusCode = StatusCodes.Status500InternalServerError };
            return Task.CompletedTask;
        }
        
    }

    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            env.EnvironmentName = "Development";
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging();

            //look at https://github.com/aspnet/Identity/blob/de3e6e08b43ee995f3a247c502fc88c1458f3ced/src/Identity/IdentityServiceCollectionExtensions.cs#L24
            #region No need for adding cookies authentication manually because services.AddIdentityAutomatically add them. Just services.ConfigureApplicationCookie(config)
            // services.AddAuthentication( options => {

            //     string scheme = CookieAuthenticationDefaults.AuthenticationScheme;

            //     options.DefaultAuthenticateScheme = scheme;
            //     options.DefaultChallengeScheme = scheme;
            //     options.DefaultScheme = scheme;

            // }).AddCookie( options => {
            //     options.Cookie.Name = "auth";
            //     options.SlidingExpiration = true;
            //     options.ExpireTimeSpan = TimeSpan.FromMinutes(30);

            //     //No need for the below since cookie authentication returns 401 for ajax calls by default.
            //     options.Events.OnRedirectToLogin = ctx => 
            //     {
            //         ctx.Response.Headers["Location"] = ctx.RedirectUri;
            //         ctx.Response.StatusCode = 401;
            //         return Task.CompletedTask;
            //     };
            //     options.Events.OnRedirectToAccessDenied = ctx =>
            //     {
            //         ctx.Response.Headers["Location"] = ctx.RedirectUri;
            //         ctx.Response.StatusCode = 401;
            //         return Task.CompletedTask;
            //     };
            // });
            #endregion

            // services.AddDbContext<LimsContext>(builder => 
            // { 
            //     //builder.UseSqlite(@"data source=D:\db.db;", ctxOptions => { ctxOptions.CommandTimeout(120); });
            //     //builder.UseInMemoryDatabase("LimsDb");
            // });
            services.AddScoped<LimsContext>( provider => 
            {
                var db = new LimsContext();
                db.Database.EnsureCreatedAsync().Wait();
                return db;
            } );
            services.AddTransient<ContactsManager>( provider => {
                var db = provider.GetService<LimsContext>();
                return new ContactsManager(db);
            } );
            services.AddTransient<TestsManager>( provider => {
                var db = provider.GetService<LimsContext>();
                return new TestsManager(db, provider);
            } );
            services.AddTransient<SamplesManager>( provider => {
                var db = provider.GetService<LimsContext>();
                return new SamplesManager(db, provider);
            } );

            Mapper.Initialize( cfg => {
                cfg.CreateMap<SampleTestParameterBaseModel, SampleTestParameterModel>();
                cfg.CreateMap<SampleBaseModel, SampleModel>();
                cfg.CreateMap<SampleTransferModel, SampleModel>();
                cfg.CreateMap<QuotationBaseModel, QuotationModel>();
                cfg.CreateMap<PurchaseOrderRequestTransferModel, PurchaseOrderRequestModel>();
                cfg.CreateMap<TestParameterMethodBaseModel, TestParameterMethodModel>();
                // cfg.CreateMap<TestTransferModel, TestParameterModel>()
                //     .ForMember( dest => dest.TestParameterMatrices, opt => { opt.MapFrom( src => { src.Matrices.Select( matrixId => new MatrixBaseModel { Id = matrixId } ) } ) } )
                //     .ForMember( dest => dest.TestParameterMethods, opt => opt.Ignore() );

                //model to transfer/viewmodels
                cfg.CreateMap<SampleTestParameterModel, SampleTestParameterBaseModel>().ReverseMap();
                cfg.CreateMap<SampleTestParameterModel, TestParameterMethodViewModel>()
                    // .ForMember( dest => dest.MethodId, opt => opt.MapFrom( src => src.MethodId ) )
                    // .ForMember( dest => dest.MethodCode, opt => opt.MapFrom( src => src.Method.Code ) )
                    // .ForMember( dest => dest.MethodName, opt => opt.MapFrom( src => src.Method.Name ) )
                    .ForMember( dest => dest.MethodUnit, opt => opt.MapFrom( src => src.Method.UnitOfMeasurement ) )
                    // .ForMember( dest => dest.TestParameterCode, opt => opt.MapFrom( src => src.TestParameter.Code ) )
                    // .ForMember( dest => dest.TestParameterName, opt => opt.MapFrom( src => src.TestParameter.Name ) )
                    // .ForMember( dest => dest.TestParameterId, opt => opt.MapFrom( src => src.TestParameterId ) )
                    .ForMember( dest => dest.TestParameterMethodPrice, opt => opt.MapFrom( src => src.ModifiedPrice ) );

                cfg.CreateMap<SampleTestParameterModel, SampleTestParameterViewModel>()
                    // .ForMember( dest => dest.MethodCode, opt => opt.MapFrom( src => src.Method.Code ) )
                    // .ForMember( dest => dest.MethodName, opt => opt.MapFrom( src => src.Method.Name ) )
                    .ForMember( dest => dest.MethodUnit, opt => opt.MapFrom( src => src.Method.UnitOfMeasurement ) );
                    // .ForMember( dest => dest.TestParameterCode, opt => opt.MapFrom( src => src.TestParameter.Code ) )
                    // .ForMember( dest => dest.TestParameterName, opt => opt.MapFrom( src => src.TestParameter.Name ) );

                cfg.CreateMap<SampleTestParameterResultModel, SampleTestParameterResultBaseModel>();

                cfg.CreateMap<TestParameterMethodModel, TestParameterMethodViewModel>()
                    .ForMember( dest => dest.MethodId, opt => opt.MapFrom( src => src.MethodId ) )
                    .ForMember( dest => dest.MethodCode, opt => opt.MapFrom( src => src.Method.Code ) )
                    .ForMember( dest => dest.MethodName, opt => opt.MapFrom( src => src.Method.Name ) )
                    .ForMember( dest => dest.MethodUnit, opt => opt.MapFrom( src => src.Method.UnitOfMeasurement ) )
                    .ForMember( dest => dest.TestParameterCode, opt => opt.MapFrom( src => src.TestParameter.Code ) )
                    .ForMember( dest => dest.TestParameterName, opt => opt.MapFrom( src => src.TestParameter.Name ) )
                    .ForMember( dest => dest.TestParameterId, opt => opt.MapFrom( src => src.TestParameterId ) )
                    .ForMember( dest => dest.TestParameterMethodPrice, opt => opt.MapFrom( src => src.Price ) );
                cfg.CreateMap<SampleModel, SampleViewModel>()
                    .ForMember( dest => dest.TestParameters, options => { options.MapFrom( src => src.SampleTestParameters ); } )
                    .ForMember( dest => dest.PurchaseOrderRequestCode, opt => opt.MapFrom( src => src.PurchaseOrderRequest.Code ) )
                    .ForMember( dest => dest.PurchaseOrderRequestReceivedDate, opt => opt.MapFrom( src => src.PurchaseOrderRequest.ReceivedDate ) )
                    .ForMember( dest => dest.ContactName, opt => opt.MapFrom( src => src.PurchaseOrderRequest.ReceivedFrom.Name ) )
                    .ForMember( dest => dest.CustomerName, opt => opt.MapFrom( src => src.PurchaseOrderRequest.ReceivedFrom.Customer.Name ) )
                    .ForMember( dest => dest.MatrixName, opt => opt.MapFrom( src => src.Matrix.Name ) );

                cfg.CreateMap<PurchaseOrderRequestModel, PurchaseOrderRequestViewModel>()
                    .ForMember( dest => dest.ContactName, options => options.MapFrom( src => src.ReceivedFrom.Name ) )
                    .ForMember( dest => dest.ContactPhoneNumber, options => options.MapFrom( src => src.ReceivedFrom.PhoneNumber ) )
                    .ForMember( dest => dest.CustomerId, options => options.MapFrom( src => src.ReceivedFrom.Customer.Id ) )
                    .ForMember( dest => dest.CustomerName, options => options.MapFrom( src => src.ReceivedFrom.Customer.Name ) )
                    .ForMember( dest => dest.CustomerPhoneNumber, options => options.MapFrom( src => src.ReceivedFrom.Customer.PhoneNumber ) );

                cfg.CreateMap<SampleModel, SampleSummaryViewModel>()
                    .ForMember( dest => dest.PurchaseOrderRequestCode, options => options.MapFrom( src => src.PurchaseOrderRequest.Code ) )
                    .ForMember( dest => dest.CustomerName, options => options.MapFrom( src => src.PurchaseOrderRequest.ReceivedFrom.Customer.Name ) )
                    .ForMember( dest => dest.MatrixName, options => options.MapFrom( src => src.Matrix.Name ) );
                    //.ForMember( dest => dest.MatrixName, options => options.MapFrom( src => src.PurchaseOrderRequest.ReceivedFrom.Customer.Name ) );
            } );

            #region Identity Initialization Options
            // services.AddDefaultIdentity<LimsUser>( config => {
            //     config.User.RequireUniqueEmail = true;
            // } ).AddEntityFrameworkStores<LimsContext>();
            // services.AddIdentityCore<LimsUser>( config => {
            //     config.User.RequireUniqueEmail = true;
            // } ).AddEntityFrameworkStores<LimsContext>();
            #endregion

            services.AddIdentity<LimsUser, IdentityRole<int>>( config => {
                
                config.User.RequireUniqueEmail = true;

                config.ClaimsIdentity.UserIdClaimType = "UserId";
                config.ClaimsIdentity.UserNameClaimType = "UserName";
                config.ClaimsIdentity.RoleClaimType = "Role";
                
            } ).AddEntityFrameworkStores<LimsContext>();
            services.ConfigureApplicationCookie( config => {
                // config.LoginPath = "";
                // config.Events.OnRedirectToLogin = (cOptions) => { cOptions.RedirectUri = ""; cOptions.Response.StatusCode = Microsoft.AspNetCore.Http.StatusCodes.Status401Unauthorized; return Task.CompletedTask; };
            } );

            services.AddAuthorization( config => {
                // config.AddPolicy("policyName", policy => {
                //     policy.RequireClaim("");
                //     policy.RequireAssertion( c => c.User.HasClaim("", "") && c.User.Identity.Name == "" );
                // });
            } );

            services.AddMvc( config => { } );
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory logger)
        {
            logger.AddConsole(Configuration.GetSection("Logging"));
            logger.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAuthentication();

            app.AddLog(logger.CreateLogger("Logger Middleware"));
            //app.UseMvc();
            app.UseMvcWithDefaultRoute();

            app.UseStaticFiles();
            app.UseStaticFiles( new StaticFileOptions() {
                FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(),  "ui")),
                RequestPath = "/ui"
            });
        }
    }

    internal static class StartupExtensions
    {
        public static void AddLog( this IApplicationBuilder app, ILogger logger )
        {
            app.Use( async (ctx, next) =>
            {
                var request = ctx.Request;
                string method = request.Method, scheme = request.Scheme, path = request.Path, host = request.Host.ToUriComponent(), queryString = request.QueryString.ToString(), protocol = request.Protocol;
                string link = $"Middeware: {protocol}:{method}:{scheme}://{host}{path}?{queryString}";
                logger.LogWarning( link );
                if(request.Method.ToUpper() == "POST" && request.ContentType.Contains( "json" ))
                {
                    int length = 0;
                    try
                    {
                        length = (int)request.Body.Length;
                    }
                    catch {}
                    if(length > 0)
                    {
                        byte [] buffer = new byte[length];
                        await request.Body.ReadAsync(buffer, 0, length);
                        logger.LogWarning(string.Format("Request Body: {0}", System.Text.Encoding.UTF8.GetString(buffer) ));
                    }
                    // logger.LogWarning(string.Format("Request Body: {0}", (new System.IO.StreamReader(request.Body)).ReadToEnd()));
                }

                try
                {
                    await next();
                }
                catch(Exception ex)
                {
                    string message = $"Exception: {ex.Message}, InnerException: {ex.InnerException?.Message??String.Empty}";
                    logger.LogError(message);
                    ctx.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    var stream = new StreamWriter(ctx.Response.Body);
                    stream.WriteLine(message);
                    stream.Flush();
                    stream.Close();
                }
            } );
        }
    }
}
