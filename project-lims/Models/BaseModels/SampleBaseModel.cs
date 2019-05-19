using System;

namespace Lims.BaseModels
{
    public class SampleBaseModel
    {
        public virtual int Id { get; set; }
        public string Code { get; set; }
        public string Location { get; set; }
        public DateTime ReceivedDate { get; set; }

        public string SamplingPoint { get; set; }
        public string SamplingBy { get; set; }
        public DateTime SamplingDate { get; set; }
        public float SamplingTemprature { get; set; }
        public string Remarks { get; set; }

        public bool Locked { get; set; } //Sealed
        public DateTime Tstamp { get; set; }

        //foreigns
        public int ReceivedByUserId { get; set; }
        public int MatrixId { get; set; }
        public int PurchaseOrderRequestId { get; set; }
    }
}