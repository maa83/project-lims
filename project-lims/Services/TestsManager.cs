using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;

using System.Linq;

using Lims.Models;
using Lims.ViewModels;

namespace Lims.Managers
{
    public class TestsManager
    {
        private LimsContext db;
        private ILogger logger;

        private TestsManager(LimsContext db)
        {
            this.db = db;
        }

        public TestsManager(LimsContext db, LoggerFactory loggerFactory) : this(db)
        {
            this.logger = loggerFactory.CreateLogger("Tests Manager");
        }

        public TestsManager(LimsContext db, IServiceProvider provider) : this( db )
        {
            this.logger = provider.GetService<ILoggerFactory>().CreateLogger("Tests Manager");
        }

        public async Task<TestParameterModel> CreateTestAsync(string name, string description)
        {
            return await CreateTestAsync(name, null, description);
        }

        public async Task<TestParameterModel> CreateTestAsync(string name, string code, string description)
        {
            var test = new TestParameterModel { Name = name, Code = code, Description = description };
            await SaveTestAsync(test);
            if(string.IsNullOrEmpty(test.Code)) test.Code = GenerateTestCode(test.Id, name);
            await SaveTestAsync(test);
            return test;
        }

        public async Task<TestParameterModel> SaveTestAsync(TestParameterModel test)
        {
            if(test.Id == 0) await db.TestParameters.AddAsync(test);
            else db.Update(test);
            
            await db.SaveChangesAsync();

            return test;
        }

        public async Task AssignTestMethodAsync(TestParameterModel testParameter, int methodId, double price)
        {
            int testParameterId = testParameter.Id;
            await db.TestParameterMethods.AddAsync(new TestParameterMethodModel { TestParameterId = testParameterId, MethodId = methodId, Price = price });
        }
        public async Task AssignTestMethodsAsync(TestParameterModel testParameter, List<int> methodIds, double price)
        {
            List<TestParameterMethodModel> methods = new List<TestParameterMethodModel>();
            foreach( int methodId in methodIds ) methods.Add( new TestParameterMethodModel { MethodId = methodId, Price = price } );
            await AssignTestMethodsAsync(testParameter, methods);
        }
        public async Task AssignTestMethodsAsync(TestParameterModel testParameter, List<TestParameterMethodModel> methods)
        {
            int testParameterId = testParameter.Id;

            //if (await db.TestParameterMethods.AnyAsync( t => t.TestParameterId == testParameterId && methods.Exists( method => method.Id == t.MethodId ) )) throw new System.Data.ConstraintException("a method violates key constraint") ;

            foreach(var method in methods) method.TestParameterId = testParameterId;
            await db.TestParameterMethods.AddRangeAsync(methods);
            await db.SaveChangesAsync();
        }

        public async Task AssignTestMatricesAsync(TestParameterModel testParameter, List<int> matrixIds)
        {
            int testParameterId = testParameter.Id;

            //if(await db.TestParameterMatrices.AnyAsync( t => t.Id == testParameterId && matrixIds.Exists( id => t.MatrixId == id ) )) throw new System.Data.ConstraintException("a matrix violates key contraint");

            List<TestParameterMatrixModel> testMatrices = matrixIds.Select( id => new TestParameterMatrixModel { MatrixId = id, TestParameterId = testParameterId } ).ToList();
            await db.TestParameterMatrices.AddRangeAsync(testMatrices);
            await db.SaveChangesAsync();
        }

        public async Task<List<MatrixModel>> GetMatrices()
        {
            return await db.Matrices.ToListAsync();
        }

        public async Task<TestParameterModel> GetTestAsync(int id)
        {
            return await db.TestParameters.Include( t => t.TestParameterMatrices ).Include( t => t.TestParameterMethods ).SingleAsync( t => t.Id == id );
        }

        public async Task<List<TestParameterModel>> GetByMatrixId(int matrixId)
        {
            //return await db.TestParameterMatrices.Where( t => t.MatrixId == matrixId ).Include( t => t.TestParameter ).Select( t => t.TestParameter ).ToListAsync();
            return await db.TestParameterMatrices.Include( t => t.TestParameter ).Where(t => t.MatrixId == matrixId).Select( t => t.TestParameter ).ToListAsync();
        }

        public async Task<List<TestParameterModel>> GetTests()
        {
            return await db.TestParameters.ToListAsync();
        }


        /*Get Method by ID */
        public async Task<MethodModel> GetMethod(int id)
        {
            return await db.Methods.SingleAsync( m => m.Id == id);
        }
        public async Task<MethodModel> SaveMethod(MethodModel method)
        {
            db.Methods.Add(method);
            await db.SaveChangesAsync();
            return method;
        }
        /*Get All Methods */
        public async Task<List<MethodModel>> GetMethods()
        {
            return await db.Methods.ToListAsync();
        }

        public async Task<List<MethodModel>> GetMethodsByTestParameterId(int testParameterId)
        {
            //return await db.Entry<TestParameterModel>( (await db.TestParameters.SingleAsync( t => t.Id == testParameterId)) );
            //var methods = (await db.TestParameters.Include( t => t.TestParameterMethods ).SingleAsync(t => t.Id == testParameterId)).TestParameterMethods;
            // foreach( var method in methods )
            // {
            //     db.Entry(method).Reference( m => m.TestParameter ).Load();
            //     db.Entry(method).Reference( m => m.Method ).Load();
            //     method.
            // }

            List<MethodModel> testMethods = new List<MethodModel>();
            if(!(await db.TestParameters.AnyAsync( t => t.Id == testParameterId ))) return testMethods;

            var testParameter = await db.TestParameters.Include( t => t.TestParameterMethods ).ThenInclude( m => m.Method ).SingleAsync( t => t.Id == testParameterId );
            if(testParameter != null && testParameter.TestParameterMethods != null && testParameter.TestParameterMethods.Count > 0)
            {
                foreach( var method in testParameter.TestParameterMethods )
                {
                    testMethods.Add(method.Method);
                }
            }

            return testMethods;
        }

        public async Task<TestParameterMethodModel> GetTestParameterMethod(int testParameterId, int methodId)
        {
            if( !(await db.TestParameterMethods.AnyAsync( t => t.MethodId == methodId && t.TestParameterId == testParameterId )) ) throw new Exception(string.Format("Test: {0} is not assigned to Method: {1}", testParameterId, methodId));

            return await db.TestParameterMethods.Include( m => m.Method ).Include( m => m.TestParameter ).SingleAsync( t => t.MethodId == methodId && t.TestParameterId == testParameterId );
        }

        public List<TestParameterMethodViewModel> GetTestParameterMethodsByTestParameterId(int testParameterId)
        {
            throw new NotImplementedException();
        }

        public List<TestParameterMethodViewModel> GetTestParameterMethods()
        {
            throw new NotImplementedException();
        }


        /* Statics */
        public static string GenerateTestCode(int id, string name)
        {
            return string.Format("{0}{1}-{2:0000}", name[0], name[name.Length], id);
        }
    }
}