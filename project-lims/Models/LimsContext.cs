
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.InMemory;
using Microsoft.AspNetCore.Identity;

using Lims.Models;
using Lims.Services;

namespace Lims
{

    public class LimsContext : DbContext
    {
        public DbSet<MatrixModel> Matrices { get; set; }
        public DbSet<SampleModel> Samples { get; set; }
        public DbSet<TestParameterModel> TestParameters { get; set; }
        public DbSet<MethodModel> Methods { get; set; }

        public DbSet<SampleTestParameterModel> SampleTestParameters { get; set; }
        public DbSet<SampleTestParameterResultModel> SampleTestParameterResults { get; set; }
        public DbSet<TestParameterMatrixModel> TestParameterMatrices { get; set; }
        public DbSet<TestParameterMethodModel> TestParameterMethods { get; set; }

        public DbSet<ContactModel> Contacts { get; set; }
        public DbSet<CustomerModel> Customers { get; set; }

        public DbSet<LimsUser> Users { get; set; }
        public DbSet<IdentityUserClaim<int>> Claims { get; set; }
        public DbSet<IdentityRole<int>> Roles { get; set; }
        public DbSet<IdentityUserRole<int>> UserRoles { get; set; }


        public DbSet<PurchaseOrderRequestModel> PurchaseOrderRequests { get; set; }
        public DbSet<QuotationModel> Quotations { get; set; }

        public LimsContext() : base()
        {

        }


        public LimsContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<SampleModel>().HasKey( s => s.Id );
            builder.Entity<SampleModel>().HasMany( s => s.SampleTestParameters ).WithOne( t => t.Sample ).HasForeignKey( t => t.SampleId ).OnDelete( DeleteBehavior.Cascade );
            builder.Entity<SampleModel>().HasOne( s => s.ReceivedBy ).WithMany( u => u.Samples ).HasForeignKey( s => s.ReceivedByUserId );

            builder.Entity<QuotationModel>().HasKey( q => q.PurchaseOrderRequestId );
            builder.Entity<PurchaseOrderRequestModel>().HasKey( p => p.Id );
            builder.Entity<PurchaseOrderRequestModel>().HasOne<QuotationModel>( p => p.Quotation ).WithOne( q => q.PurchaseOrderRequest ).OnDelete( DeleteBehavior.Cascade );
            builder.Entity<PurchaseOrderRequestModel>().HasMany<SampleModel>( p => p.Samples).WithOne( s => s.PurchaseOrderRequest ).HasForeignKey( s => s.PurchaseOrderRequestId ).OnDelete( DeleteBehavior.Cascade );

            builder.Entity<IdentityUserRole<int>>().HasKey( r => new { r.UserId, r.RoleId } );

            builder.Entity<TestParameterMatrixModel>().HasKey( t => t.Id );
            builder.Entity<TestParameterMatrixModel>().HasAlternateKey( t => new { t.MatrixId, t.TestParameterId } );

            builder.Entity<TestParameterMethodModel>().HasKey( t => t.Id );
            builder.Entity<TestParameterMethodModel>().HasAlternateKey( t => new { t.MethodId, t.TestParameterId } );

            builder.Entity<SampleTestParameterModel>().HasKey( s => s.Id );
            // builder.Entity<SampleTestParameterModel>().HasAlternateKey( s => new { s.SampleId, s.TestParameterId, s.MethodId } );
            // builder.Entity<SampleTestParameterModel>().HasAlternateKey( s => new { s.SampleId, s.TestParameterMethodId } );
            builder.Entity<SampleTestParameterModel>().HasMany( s => s.SampleTestParameterResults ).WithOne( r => r.SampleTestParameter ).OnDelete(DeleteBehavior.Cascade);

            builder.Entity<SampleTestParameterResultModel>().HasKey( r => r.Id );
            builder.Entity<SampleTestParameterResultModel>().HasAlternateKey( r => new { r.SampleTestParameterId, r.Revision } );

            LimsUser user = new LimsUser() { Id = 1, UserName = "moa995", NormalizedUserName = "MOA995", Email = "mabdullah83@gmail.com", NormalizedEmail = "mabdullah83@gmail.com".ToUpper(), EmailConfirmed = true, SecurityStamp = "lol" };
            PasswordHasher<LimsUser> hasher = new PasswordHasher<LimsUser>();
            user.PasswordHash = hasher.HashPassword(user, "maa");
            builder.Entity<LimsUser>().HasData(user);

            var userIdClaim = new IdentityUserClaim<int> { UserId = 1, Id = 1, ClaimType = "Claim1", ClaimValue = "1" };
            var userNameClaim = new IdentityUserClaim<int> { UserId = 1, Id = 2, ClaimType = "Claim2", ClaimValue = "moa995" };
            var userRoleClaim = new IdentityUserClaim<int> { UserId = 1, Id = 3, ClaimType = "Claim3", ClaimValue = "admin" };
            builder.Entity<IdentityUserClaim<int>>().HasData(userIdClaim, userNameClaim, userRoleClaim);

            var customer = new CustomerModel { Id = 1, Name = "KNPC", PhoneNumber = "+965-999999", Address = "Salmyia" };
            var contact = new ContactModel { Id = 1, Name = "Mohammad Abdullah", PhoneNumber = "+965-99828764", CustomerId = 1 };
            var contact2 = new ContactModel { Id = 2, Name = "Ibrahim Al-Hajeri", PhoneNumber = "+965-0017235", CustomerId = 1 };

            var customer1 = new CustomerModel { Id = 2, Name = "Architecture", PhoneNumber = "+965-999999", Address = "Salmyia" };
            var contact11 = new ContactModel { Id = 3, Name = "Hiba Abdulqader", PhoneNumber = "+965-99828764", CustomerId = 2 };
            var contact12 = new ContactModel { Id = 4, Name = "Khalil", PhoneNumber = "+965-63273627", CustomerId = 2 };
            var contact13 = new ContactModel { Id = 5, Name = "Mohammad", PhoneNumber = "+965-8273928", CustomerId = 2 };

            var customer2 = new CustomerModel { Id = 3, Name = "Kindergarten", PhoneNumber = "+965-999999", Address = "Salmyia" };
            var contact21 = new ContactModel { Id = 6, Name = "Yousef Abdullah", PhoneNumber = "+965-1234567", CustomerId = 3 };
            var contact22 = new ContactModel { Id = 7, Name = "Celen", PhoneNumber = "+965-7654321", CustomerId = 3 };
            builder.Entity<CustomerModel>().HasData(customer, customer1, customer2);
            builder.Entity<ContactModel>().HasData(contact, contact2, contact11, contact12, contact13, contact21, contact22);


            var matrixSolid = new MatrixModel { Id = 1, Name = "Solid", Code = MatrixModel.Codes.Solid };
            var matrixLiquid = new MatrixModel { Id = 2, Name = "Liquid", Code = MatrixModel.Codes.Liquid };
            var matrixGas = new MatrixModel { Id = 3, Name = "Gas", Code = MatrixModel.Codes.Gas };
            builder.Entity<MatrixModel>().HasData(matrixSolid, matrixLiquid, matrixGas);

            var method = new MethodModel { Id = 1, Name = "Method1", Description = "a generic test method", UnitOfMeasurement = "cm^2", Code = "MTD" };
            var sulphurMethod1 = new MethodModel { Id = 2, Name = "Sulphur Method", Description = "a test method for sulphur", UnitOfMeasurement = "p.cm^2", Code = "SLPRTST" };
            var carbonMethod2 = new MethodModel { Id = 3, Name = "Carbon Method", Description = "a test method for carbon", UnitOfMeasurement = "cm^2", Code = "CBNTST" };
            builder.Entity<MethodModel>().HasData(method, sulphurMethod1, carbonMethod2);

            var sulphurTest = new TestParameterModel { Id = 1, Name = "Sulphur Test", Code = "SLPTST", Description = "Test for Sulphur 'S'" };
            var carbonTest = new TestParameterModel { Id = 2, Name = "Carbon Test", Code = "CBNTST", Description = "Test for carbon 'C'" };
            var waterTest = new TestParameterModel { Id = 3, Name = "Water Test", Code = "WTRTST", Description = "Test for water 'H2O'" };
            var clorideTest = new TestParameterModel { Id = 4, Name = "Cloride Test", Code = "CLTST", Description = "Test for Cloride 'CL2'" };
            //builder.Entity<TestParameterModel>().HasData(sulphurTest, carbonTest, waterTest, clorideTest);

            var genericTestMethodforSulphur = new TestParameterMethodModel { Id = 1, MethodId = 1, TestParameterId = 1, Price = 50.250d };
            var genericTestMethodforCarbon = new TestParameterMethodModel { Id = 2, MethodId = 1, TestParameterId = 2, Price = 23.200d };
            var sulpherTestMethod = new TestParameterMethodModel { Id = 3, MethodId = 2, TestParameterId = 1, Price = 30.400d };
            var carbonTestMethod = new TestParameterMethodModel { Id = 4, MethodId = 3, TestParameterId = 2, Price = 10.850d };
            //builder.Entity<TestParameterMethodModel>().HasData(genericTestMethodforCarbon, genericTestMethodforSulphur, sulpherTestMethod, carbonTestMethod);

            var carbonSolidMatrixTest = new TestParameterMatrixModel { Id = 1, TestParameterId = 1, MatrixId = 1 };
            var sulphurSolidMatrixTest = new TestParameterMatrixModel { Id = 2, TestParameterId = 2, MatrixId = 1 };
            var waterLiquidMatrixTest = new TestParameterMatrixModel { Id = 3, TestParameterId = 3, MatrixId = 2 };
            var clorideGasMatrixTest = new TestParameterMatrixModel { Id = 4, TestParameterId = 4, MatrixId = 3 };
            //builder.Entity<TestParameterMatrixModel>().HasData(carbonSolidMatrixTest, sulphurSolidMatrixTest, waterLiquidMatrixTest, clorideGasMatrixTest);


            var por = new PurchaseOrderRequestModel { //Id = 1, 
                                                    ContactId = 1, Code = PurchaseOrderRequestService.GeneratePORCode(1, 1), ReceivedDate = DateTime.Now };
            // builder.Entity<PurchaseOrderRequestModel>().HasData(por);

            var sulphurSample = new SampleModel { //Id = 1, 
                                        Locked = false, 
                                        Location = "Ahmadi",
                                        Remarks = "No Remarks", 
                                        ReceivedByUserId = 1, 
                                        SamplingPoint = "Salmyia", 
                                        SamplingBy = "Mohammad", 
                                        MatrixId = matrixSolid.Id,
                                        PurchaseOrderRequestId = 1,
                                        ReceivedDate = DateTime.Now,
                                        SamplingDate = DateTime.Now.AddDays(-3), Code = SampleService.GenerateSampleCode(matrixSolid.Name, 1, 1) } ;


            var carbonSample = new SampleModel { //Id = 2, 
                                        Locked = false, 
                                        Location = "Sabhan",
                                        Remarks = "Carbon Sample", 
                                        ReceivedByUserId = 1, 
                                        SamplingPoint = "Salmyia", 
                                        SamplingBy = "Yousef", 
                                        MatrixId = matrixSolid.Id,
                                        PurchaseOrderRequestId = 1,
                                        ReceivedDate = DateTime.Now,
                                        SamplingDate = DateTime.Now.AddDays(-6), Code = SampleService.GenerateSampleCode(matrixSolid.Name, 1, 1) } ;
            // builder.Entity<SampleModel>().HasData(sulphurSample, carbonSample);

            var sulphurSampleTestParameter = new SampleTestParameterModel { //Id = 1, 
                                                                            MethodId = 2, TestParameterId = 1, TestParameterMethodId = 3, SampleId = 1, ModifiedPrice = 8 };
            var sulphurGenericSampleTestParameter = new SampleTestParameterModel { //Id = 2, 
                                                                                    MethodId = 1, TestParameterId = 1, TestParameterMethodId = 1, SampleId = 1, ModifiedPrice = 8 };

            var carbonSampleTestParameter = new SampleTestParameterModel { //Id = 3, 
                                                                            MethodId = 3, TestParameterId = 2, TestParameterMethodId = 4, SampleId = 2, ModifiedPrice = 8 };
            var carbonGenericSampleTestParameter = new SampleTestParameterModel { //Id = 4, 
                                                                                    MethodId = 1, TestParameterId = 2, TestParameterMethodId = 2, SampleId = 2, ModifiedPrice = 8 };
            // builder.Entity<SampleTestParameterModel>().HasData(sulphurSampleTestParameter, sulphurGenericSampleTestParameter, carbonSampleTestParameter, carbonGenericSampleTestParameter);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            //options.UseInMemoryDatabase("LimsDb");
            string path = System.IO.Path.Combine( System.IO.Directory.GetCurrentDirectory(), "LimsDb.db" );
            options.UseSqlite($"data source={path}");
            options.EnableSensitiveDataLogging();
            options.ConfigureWarnings( warning => warning.Ignore( Microsoft.EntityFrameworkCore.Diagnostics.InMemoryEventId.TransactionIgnoredWarning ) );
        }
    }
}