

using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authorization;

using System.Collections.Generic;
using System.Collections;
using System.Linq;

namespace Lims
{
    public class TestPolicyRequirement : IAuthorizationRequirement
    {
        public string UserName { get; private set; }
        public TestPolicyRequirement(string userName)
        {
            this.UserName = userName;
        }
    }

    /*
        In cases where you want evaluation to be on an OR basis, implement multiple handlers for a single requirement.
        All requirement handlers will be excecuted. if one succeeds, policy succeeds.
     */
    public class TestPolicyHandler : AuthorizationHandler<TestPolicyRequirement>
    {
        protected override Task HandleRequirementAsync( AuthorizationHandlerContext context, TestPolicyRequirement requirement )
        {
            if( context.User != null && context.User.Identity.Name == requirement.UserName)
                context.Succeed(requirement);
            
            return Task.CompletedTask;
        }
    }

    //Handler for multiple requirements
    public class TestMultiplePolicyHandler : IAuthorizationHandler
    {
        public Task HandleAsync(AuthorizationHandlerContext context)
        {
            foreach( var req in context.PendingRequirements.ToList() )
            {
                if(req is TestPolicyRequirement)
                    if(((TestPolicyRequirement)req).UserName == context.User.Identity.Name)
                        context.Succeed(req);
            }
            if(context.Resource is AuthorizationFilterContext ctx)
                ctx.HttpContext.Response.Headers.Add("x-authorization-policy", ctx.ActionDescriptor.DisplayName);
            return Task.CompletedTask;
        }
    }

    public class TestActionFilter : Microsoft.AspNetCore.Mvc.Filters.IActionFilter
    {
        public void OnActionExecuted(Microsoft.AspNetCore.Mvc.Filters.ActionExecutedContext context)
        {
            context.HttpContext.Response.Headers.Add("x-action-filter", "action");
        }
        public void OnActionExecuting(Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext context)
        {

        }
    }

    public class TestActionFilterAsync : Microsoft.AspNetCore.Mvc.Filters.IAsyncActionFilter
    {
        public Task OnActionExecutionAsync(Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext context, Microsoft.AspNetCore.Mvc.Filters.ActionExecutionDelegate next)
        {
            //do work
            return next();
        }
    }

    public class TestAuthorizationFilter : Microsoft.AspNetCore.Mvc.Filters.IAuthorizationFilter
    {
        public void OnAuthorization(Microsoft.AspNetCore.Mvc.Filters.AuthorizationFilterContext context)
        {
            context.HttpContext.Response.Headers.Add("x-authorization-filter", context.HttpContext.User == null ? "Anonymous" : context.HttpContext.User.Identity.Name);
        }
    }

    public class TestAuthorizationFilterAsync : Microsoft.AspNetCore.Mvc.Filters.IAsyncAuthorizationFilter
    {
        public Task OnAuthorizationAsync(Microsoft.AspNetCore.Mvc.Filters.AuthorizationFilterContext context)
        {
            return Task.CompletedTask;
        }
    }

    public class TestActionContraint : Microsoft.AspNetCore.Mvc.ActionConstraints.IActionConstraint
    {
        public int Order { get { return 1; } }

        public bool Accept(Microsoft.AspNetCore.Mvc.ActionConstraints.ActionConstraintContext context)
        {
            // context.RouteContext.HttpContext
            // context.CurrentCandidate.Action
            return true;
        }
    }
}