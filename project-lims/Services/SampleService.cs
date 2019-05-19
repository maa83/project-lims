

using System;
using Lims.Models;

using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Reflection;

namespace Lims.Services
{
    public interface ITestManager
    {
        TestParameterModel CreateParameter(string code, string name, string description);
        MatrixModel CreateMatrix(string name);
        MethodModel CreateMethod(string name, string description);

        void AssignMatrix(TestParameterModel parameter, MatrixModel matrix);
        void AssignMethod(TestParameterModel parameter, MethodModel method);
        void CreateAndAssignMatrix(TestParameterModel parameter, string matrixName);
        void CreateAndAssignMethod(TestParameterModel parameter, string name, string description);

        void DeleteParameter();
        void UnassignMatrix();
        void UnassignMethod();
        void UpdateParameter();
        void DeleteMatrix();
        void DeleteMethod();

        TestParameterModel GetParameterById();
        List<TestParameterModel> FindParametersByCode();
        List<TestParameterModel> FindParametersByName();
        List<TestParameterModel> FindParametersByMatrix();
        List<TestParameterModel> FindParametersByMethod();
    }

    public interface ISampleManager
    {
        void CreateSample();
        void UpdateSample();
        void DeleteSample();

        SampleModel GetSampleById();
        List<SampleModel> FindSamplesByCode();
        List<SampleModel> FindSamplesByReceivedDateRange();
        List<SampleModel> FindSamplesBySamplingDateRange();
        List<SampleModel> FindSamplesByCustomerId();
        List<SampleModel> FindSamplesByContactId();

        void AddSampleTestParameterResult();
    }

    
    public class SampleService
    {
        private readonly DbContext Db;

        public SampleService(DbContext db)
        {
            this.Db = db;
        }

        public static string GenerateSampleCode(string matrixName, int customerId, int sampleId)
        {
            return string.Format("{0}-{1}-{2}-{3:ddMMyy}", MatrixModel.Codes.Get(matrixName), customerId, sampleId, DateTime.Today);
        }

        public SampleBuilder Create()
        {
            return new SampleBuilder(this);
        }

        public void ApproveSample(SampleModel sample)
        {
            sample.Locked = true;
            //sample.ApprovedOn = DateTime.Now;
        }

        public void SaveChanges(SampleModel sample)
        {
            Db.Update<SampleModel>(sample);
            //Db.SaveChanges();
            List<SampleModel> samples = this.FindBy( s => s.Id ).WithRange(2, 4);
            var testSample = this.FindBy( s => s.Id ).WithValue(1);
        }

        public Criteria FindBy(Func<SampleModel, int> expr)
        {
            return new Criteria(expr);
        }

        public class Criteria
        {
            Func<SampleModel, int> expr;
            // enum Condition
            // {
            //     Value,
            //     Range
            // }
            // Condition condition = Condition.Value;
            // List<int> parameters = new List<int>();

            public Criteria(Func<SampleModel, int> expr)
            {
                this.expr = expr;
            }

            public SampleModel WithValue(int val)
            {
                var sample = new SampleModel { Id = val };
                if(expr(sample) == val ) return sample;
                return null;
            }

            public List<SampleModel> WithRange(int min, int max)
            {
               var samples = new List<SampleModel>() { new SampleModel { Id = min }, new SampleModel { Id = max } };

               var foundSamples = new List<SampleModel>();
               foreach( var sample in samples )
               {
                   var value = expr(sample);
                   if( value <= max && value >= min  )
                        foundSamples.Add(sample);
               }

               return samples;
            }
        }
    }


    public class PurchaseOrderRequestService
    {
        public PurchaseOrderRequestService()
        {

        }
        public PurchaseOrderRequestService(LimsContext db)
        {

        }

        public static string GeneratePORCode(int porId, int customerId)
        {
            return string.Format("PO-{0}-{1}-{2:ddMMyy}", customerId, porId, DateTime.Today);
        }
    }

    public class TestParameterService
    {
        private LimsContext Db { get; set; }
        public TestParameterService(LimsContext db)
        {
            this.Db = db;
        }

        
    }

    public class SampleBuilder
    {
        private readonly SampleService Service;
        public SampleModel Sample { get; private set; }

        public SampleBuilder(SampleService service)
        {
            this.Service = service;
        }

        public SampleBuilder Approve()
        {
            this.Service.ApproveSample(Sample);
            return this;
        }

        public SampleBuilder Submit()
        {
            Service.SaveChanges(Sample);
            return this;
        }

        public SampleModel Entity()
        {
            return Sample;
        }
    }

    public class Builder<T>
    {

    }

    public interface IBuilder<T>
    {

    }

    public interface IService<T>
    {

    }

    public class Model : IModel
    {
        public int Key { get; }
        public int Id { get; set; }
    }

    public class StringModel : IModel<string>
    {
        public string Key { get; }
    }

    public class CompositeModel : IModel<object>
    {
        public object Key { get { return new { id = 1, name = "Mohammad" }; }  }
    }

    public interface IModel<TKey>
    {
        TKey Key { get; }
    }

    public interface IModel : IModel<int>
    {

    }

    public class ModelService : IModelService<Model>
    {
        public List<Model> Get()
        {
            return new List<Model>();
        }

        public Model Get(int id)
        {
            return new Model() { Id = id };
        }

        public List<Model> FindByCriteria(Criteria<Model> crit)
        {
            return new List<Model>();
        }

        public static void Test()
        {
            // ModelService service = new ModelService();
            // service.FindByCriteria( new Criteria<Model>( s => s.Id ) );
        }
    }

    public interface IModelService<T> where T : IModel
    {
        List<T> Get();
        T Get(int Id);
        List<T> FindByCriteria(Criteria<T> crit);
    }

    public class Criteria<T> where T : IModel
    {
        Func<SampleModel, int> expr;
        // enum Condition
        // {
        //     Value,
        //     Range
        // }
        // Condition condition = Condition.Value;
        // List<int> parameters = new List<int>();

        public Criteria(Func<SampleModel, int> expr)
        {
            this.expr = expr;
        }

        public SampleModel WithValue(int val)
        {
            var sample = new SampleModel { Id = val };
            if(expr(sample) == val ) return sample;
            return null;
        }

        public List<SampleModel> WithRange(int min, int max)
        {
            var samples = new List<SampleModel>() { new SampleModel { Id = min }, new SampleModel { Id = max } };

            var foundSamples = new List<SampleModel>();
            foreach( var sample in samples )
            {
                var value = expr(sample);
                if( value <= max && value >= min  )
                    foundSamples.Add(sample);
            }

            return samples;
        }
    }

    /*
    SubmittedBy
    ApprovedBy
    RejectedBy
    GeneratedBy
    ReceivedBy


    Actions
    AddSample => ExecuteAction

    Action:
    * Name
    * By
    * On

    Actions:
    * Submit
    * Approve
    * Reject
    * Lock
    * Unlock
    * Generate

    ActionManager
    RegisterAction(name)
    RegisterActions(enum, collection)
    ExecuteAction(name, by, on)
    GetObjectStatus() //Approved, Submitted, Locked etc ....

    Intercepts


    IManager
    {
        Create();
    }
    IUserManager : IManager
    {
        AddToRole();
    }

    class Manager
    {
        public Manager();
        
    }

    class Manager<T>
    {
        public Manager(T actionManager)
    }

    class UserManager : IUserManager
    {
        virtual AddToRole()
        {
            //Somecode
        }
    }
    class UserManager<T> : UserManager where T is IActionManager
    {
        T actionManager;
        UserManager(T actionManager)
        {
        }
        
        override AddToRole()
        {
            //execute action code
            actionManager.ExecuteAction('AddToRole', context.User, DateTime.Now);
            
            //call original implementation
            base.AddToRole();
        }
    }

    static void AddActionManager(this IServiceCollection services)
    {
        services.
    }

     */
}