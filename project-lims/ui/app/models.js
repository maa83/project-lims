

/***********************/
    /********Models*********/
    /***********************/

    class TestParameterModel
    {
        constructor({ id=0, name='', code='', description='', matrices=[], methods=[] }) {
            this.id = id;
            this.name = name;
            this.code = code;
            this.description = description;
            this.matrices = matrices;
            this.methods = [];
        }

        loadMethods() {
            let self = this;
            return DataManagers.TestParameters.GetMethods(this.id).then( methods => { self.methods = methods; return methods; } );
        }
        loadMatrices() {
            throw 'Not Implemented';
        }
    }

    class MethodModel
    {
        constructor({ id=0, name='', description='', unitOfMeasurement='', code='' }) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.unitOfMeasurement = unitOfMeasurement;
            this.code = code;
            this.testParameters = [];
        }

        loadTestParameters() {
            this.testParameters = DataManagers.TestParameters.GetByMethodId(this.id);
        }
    }

    class PurchaseOrderRequestModel
    {
        constructor({ id=0, code='', contactId=0, receivedDate=new Date(), samples=[], quotation=null }) {
            this.id = id;
            this.code = code;
            this.contactId = contactId;
            this.receivedDate = receivedDate;
            this.samples = samples;
            this.quotation = quotation;
        }
    }

    class SampleTestParameterModel
    {
        constructor({sampleId=0, testParameterId=0, methodId=0, modifiedPrice=0}) {
            this.sampleId = sampleId;
            this.testParameterId = testParameterId;
            this.methodId = methodId;
            this.modifiedPrice = modifiedPrice;
        }
    }

    class SampleModel
    {
        constructor({ id=0, code='', matrixId=0, location='', receivedDate=new Date(),
                    sampleTestParameters=[], samplingPoint='',
                    samplingBy='', samplingDate=moment().add(-3, 'day').toDate(), 
                    samplingTemprature=0, remarks='', locked=false }) {
            this.id = id;
            this.code = code;
            this.matrixId = matrixId;
            this.location = location;
            this.receivedDate = receivedDate;

            this.samplingPoint = samplingPoint;
            this.samplingBy = samplingBy;
            this.samplingDate = samplingDate;
            this.samplingTemprature = samplingTemprature;
            this.remarks = remarks;
            this.locked = locked;

            this.sampleTestParameters = sampleTestParameters;


            this.Tstamp = new Date();
            this.receivedByUserId = 0;
            this.purchaseOrderRequestId = 0;
        }
    }

    class QuotationModel
    {
        constructor({ samplingFees=0, extraFees=0, extraFeesReason=null, discount=0, purchaseOrderRequestId=0, tstamp=new Date() }) {
            this.samplingFees = samplingFees;
            this.extraFees = extraFees;
            this.extraFeesReason = extraFeesReason;
            this.discount = discount;
            this.purchaseOrderRequestId = purchaseOrderRequestId;

            this.tstamp = tstamp;

            this.purchaseOrderRequest = null;
        }

        loadPurchaseOrderRequest() {
            this.purchaseOrderRequest = DataManagers.PurchaseOrder.Get(this.purchaseOrderRequestId);
        }

        getPurchaseRequest(saveLocal=true) {
            if(!this.purchaseOrderRequest) {
                if(saveLocal) this.loadPurchaseOrderRequest();
                else return DataManagers.PurchaseOrder.Get(this.purchaseOrderRequestId);
            }
            return this.purchaseOrderRequest;
        }
    }

    class UserModel
    {
        constructor({id=1, name=null, claims=[]}) {

        }
    }

    class CustomerModel
    {
        constructor({ id=1, name='', phoneNumber='', address='' }) {
            this.id = id;
            this.name = name;
            this.phoneNumber = phoneNumber;
            this.address = address;
            this.contacts = [];
        }

        async loadContacts() {
            let result = await DataManagers.Customers.GetContacts(this.id);
            console.log(result);
            this.contacts = await DataManagers.Customers.GetContacts(this.id);
        }
    }
    class ContactModel
    {
        constructor({ id=0, name='', phoneNumber='', customerId=0 }) {
            this.id = id;
            this.name = name;
            this.phoneNumber = phoneNumber;
            this.customerId = customerId;
        }
    }

    class ContactViewModel
    {
        constructor({ id=0, name='', phoneNumber='', customerName='' }) {
            this.id = id;
            this.name = name;
            this.phoneNumber = phoneNumber;
            this.customerName = customerName;
        }
    }

    class MatrixModel
    {
        constructor({id=1, name='', code=''}) {
            this.id = id;
            this.name = name;
            this.code = code;

            this.testParameters = [];
        }

        loadTestParameters() {
            let self = this;
            return DataManagers.TestParameters.GetByMatrixId(this.id).then( testParameters => { self.testParameters = testParameters; return testParameters; } );
        }
    }


    /***********************/
    /*******ViewModels******/
    /***********************/

    class TestParameterViewModel
    {
        constructor({id=0, name, code, methodId, methodName, methodUnit, price=0}) {
            this.id = id;
            this.name = name;
            this.code = code;
            this.methodId = methodId;
            this.methodName = methodName;
            this.methodCode = '';
            this.methodUnit = methodUnit;
            this.price = price;
        }
    }

    class TestParameterMethodViewModel
    {
        constructor({testParameterId ,testParameterName ,testParameterCode ,testParameterDescription ,methodId ,methodName ,methodCode ,methodDescription ,methodUnit ,testParameterMethodPrice}) {
            this.testParameterId = testParameterId;
            this.testParameterName = testParameterName;
            this.testParameterCode = testParameterCode;
            this.testParameterDescription = testParameterDescription;
            this.methodId = methodId;
            this.methodName = methodName;
            this.methodCode = methodCode;
            this.methodDescription = methodDescription;
            this.methodUnit = methodUnit;
            this.testParameterMethodPrice = testParameterMethodPrice;
        }
    }

    

    class PurchaseOrderRequestViewModel
    {
        constructor({id=0, code='', samplingFees=0, extraFees=0, extraFeesReason='', discount=0, contactId=0, contactName='', contactPhoneNumber='', customerId=0, customerName='', customerPhoneNumber='', receivedDate=new Date(), tstamp=null, samples=[]}) {
            this.id = id;
            this.code = code;
            this.receivedDate = receivedDate;

            this.samplingFees = samplingFees;
            this.extraFees = extraFees;
            this.extraFeesReason = extraFeesReason
            this.discount = discount;

            this.customerId = customerId;
            this.customerName = customerName;
            this.customerPhoneNumber = customerPhoneNumber;
            this.contactId = contactId;
            this.contactName = contactName;
            this.contactPhoneNumber = contactPhoneNumber;

            this.tstamp = tstamp;

            this.samples = samples;
        }
    }

    class SampleViewModel
    {
        constructor({ id=0, code='', matrixId=0, matrixName='', location='', receivedDate=new Date(),
                    testParameters=[], samplingPoint='',
                    samplingBy='', samplingDate=moment().add(-3, 'day').toDate(), 
                    samplingTemprature=0, remarks='', locked=false,
                    customerName='', contactName='', purchaseOrderRequestCode='', purchaseOrderRequestReceivedDate='' }) {
            this.id = id;
            this.code = code;
            this.matrixId = matrixId;
            this.location = location;
            this.receivedDate = receivedDate;

            this.samplingPoint = samplingPoint;
            this.samplingBy = samplingBy;
            this.samplingDate = samplingDate;
            this.samplingTemprature = samplingTemprature;
            this.remarks = remarks;
            this.locked = locked;

            this.testParameters = testParameters;

            this.receivedByUserId = 0;
            this.purchaseOrderRequestId = 0;

            //extra
            this.matrixName = matrixName;
            this.purchaseOrderRequestCode = purchaseOrderRequestCode;
            this.purchaseOrderReceivedDate = purchaseOrderRequestReceivedDate;
            this.contactName = contactName;
            this.customerName = customerName;
        }

        extractSampleModel() {
            //return new SampleModel({id: this.id, code: this.code, matrixId: this.matrixId, location: this.location});
        }
    }

    class SampleSummaryViewModel
    {
        constructor({id, location, code, receivedDate, matrixName, customerName, purchaseOrderRequestCode}) {
            this.id = id;
            this.location = location;
            this.code = code;
            this.receivedDate = receivedDate;
            this.matrixName = matrixName;
            this.customerName = customerName;
            this.purchaseOrderRequestCode = purchaseOrderRequestCode;
        }
    }

    class SampleTestParameterResult
    {
        constructor({id, result, revision, sampleTestParameterId}) {
            this.id = id;
            this.result = result;
            this.revision = revision;
            this.sampleTestParameterId = sampleTestParameterId;
        }
    }