
using System;
using Microsoft.AspNetCore.Identity;

using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

using System.Linq;

namespace Lims
{
    public class TestUserIdentity : IdentityUser<int>
    {
        public string CustomField { get; set; }

        public List<TestUserClaim> Claims { get; set; }

    }


    public class TestUserClaim : IdentityUserClaim<int>
    {
        public TestUserIdentity User { get; set; }
    }

    public class TestUserStore : IUserStore<TestUserIdentity>
    {
        private IdentityContext _db { get; set; }

        public TestUserStore(IdentityContext db)
        {
            this._db = db;
        }

        public Task<IdentityResult> CreateAsync(TestUserIdentity user, CancellationToken cancellationToken)
        {
            _db.AddAsync(user).Wait();

            return Task.FromResult(IdentityResult.Success);
        }
        
        public Task<IdentityResult> DeleteAsync(TestUserIdentity user, CancellationToken cancellationToken)
        {
            return Task.FromResult(IdentityResult.Success);
        }
        
        public Task<TestUserIdentity> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            return _db.Users.SingleAsync( u => u.Id == Convert.ToInt32(userId) );
        }
        
        public Task<TestUserIdentity> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            if(string.IsNullOrEmpty(normalizedUserName))
                return Task.FromResult<TestUserIdentity>(null);

            //_db.Entry<TestUserIdentity>( _db.Users.Where( u => u.NormalizedUserName == normalizedUserName ) ).Collection( t => t.Claims ).Load();
            //var user = _db.Users.Where<TestUserIdentity>( u => u.NormalizedUserName == "MOA995" ).FirstOrDefaultAsync();

            //return user;
            
            return _db.Users.SingleOrDefaultAsync( u => u.NormalizedUserName == normalizedUserName );
        }
        
        public Task<string> GetNormalizedUserNameAsync(TestUserIdentity user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedUserName);
        }
        
        public Task<string> GetUserIdAsync(TestUserIdentity user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Id.ToString());
        }
        
        public Task<string> GetUserNameAsync(TestUserIdentity user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }
        
        public Task SetNormalizedUserNameAsync(TestUserIdentity user, string normalizedName, CancellationToken cancellationToken)
        {
            user.NormalizedUserName = normalizedName;
            return Task.CompletedTask;
        }
       
        public Task SetUserNameAsync(TestUserIdentity user, string userName, CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
        
        public Task<IdentityResult> UpdateAsync(TestUserIdentity user, CancellationToken cancellationToken)
        {
            return Task.FromResult(IdentityResult.Success);
        }


        public void Dispose()
        {

        }
    }

    public class TestUserValidator : IUserValidator<TestUserIdentity>
    {
        public IPasswordHasher<TestUserIdentity> hasher { get; set; }
        public TestUserValidator(IPasswordHasher<TestUserIdentity> hasher)
        {
            this.hasher = hasher;
        }
        public Task<IdentityResult> ValidateAsync(UserManager<TestUserIdentity> manager, TestUserIdentity user)
        {
            var foundUser = manager.FindByNameAsync(user.UserName).Result;
            IdentityResult result = IdentityResult.Success;
            if(foundUser == null)
            {
                result = IdentityResult.Failed( new IdentityError { Code = "1", Description = "User not found" } );

            }
            else
            {
                if(foundUser.PasswordHash != user.PasswordHash )
                {
                    result = IdentityResult.Failed( new IdentityError { Code = "1", Description = "Wrong password" } );
                }
            }

            result = IdentityResult.Failed( new IdentityError { Code = "1", Description = "yellow" } );
            
            return Task.FromResult( result );
        }
    }

    public class TestPasswordHasher : PasswordHasher<TestUserIdentity>
    {
        
    }
}