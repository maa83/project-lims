using System;


namespace Lims.BaseModels
{
    public class SampleTestParameterResultBaseModel
    {
        public virtual int Id { get; set; }
        public string Result { get; set; }
        public short Revision { get; set; }
        public DateTime Tstamp { get; set; }

        //Foreign
        public int SampleTestParameterId { get; set; }
        public int UserId { get; set; }
    }
}