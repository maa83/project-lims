using System;
using System.Collections.Generic;

using Lims.BaseModels;

namespace Lims.TransferModels
{
    public class SampleTransferModel : SampleBaseModel
    {
        public List<SampleTestParameterBaseModel> SampleTestParameters { get; set; }
    }
}