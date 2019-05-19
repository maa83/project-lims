using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Data;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http;

using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using NPOI.HSSF.Util;
using NPOI.SS.Util;
using NPOI.XWPF.UserModel;

using AutoMapper;

using System.IO;

using Lims.Models;
using Lims.BaseModels;
using Lims.ViewModels;
using Lims.Managers;


namespace Lims
{
    public class SamplesController : Controller
    {
        public LimsContext db { get; private set; }
        public ILogger logger { get; private set; }
        public UserManager<LimsUser> userMgr { get; private set; }

        private SamplesManager sampleService;


        public SamplesController(LimsContext db, ILoggerFactory logFactory, UserManager<LimsUser> userMgr, SamplesManager sampleService)
        {
            this.db = db;
            this.logger = logFactory.CreateLogger("SamplesLogger");
            this.userMgr = userMgr;
            this.sampleService = sampleService;
        }

        [Authorize]
        public IActionResult Index()
        {

            //ViewData["Name"] = "Mohammad";

            foreach(var claim in HttpContext.User.Claims)
            {
                logger.LogWarning($"{claim.Type}:{claim.Value}");
            }

            return View();
        }

        public IActionResult Insert()
        {
            var testMethod = new TestParameterMethodModel() { 
                Id = 1, 
                TestParameter = new TestParameterModel() {
                    Id = 1,
                    Name = "TestTest",
                    Description = "Just a test Test"
                },
                Method = new MethodModel() {
                    Id = 1,
                    Name = "TestMethod",
                    Description = "Just a test Method"
                }
            };
            db.Add(testMethod);
            db.SaveChanges();

            return Ok();
        }

        public IActionResult Update()
        {
            var test = db.Entry<MethodModel>( db.Methods.Where( m => m.Id == 1 ).Single() ).Collection(m => m.TestParameterMethods).Query().Where( tm => tm.Id == 1 ).Single();
            test.Method = new MethodModel() {
                Id = 2,
                Name = "New Test Method",
                Description = "Testing Update Functionality"
            };
            db.SaveChanges();
            return Ok();
        }

        //[Authorize]
        [HttpGet("[controller]/")]
        public async Task<IActionResult> GetSamples()
        {
            return Json(Mapper.Map<List<SampleModel>, List<SampleSummaryViewModel>>(await sampleService.GetSamples()));
        }

        [HttpGet("[controller]/{id:int}")]
        public async Task<IActionResult> GetSample(int id)
        {
            var model = await sampleService.GetSample(id);
            var viewModel = Mapper.Map<SampleModel, SampleViewModel>(model);
            logger.LogWarning($"{model.SampleTestParameters.Count} , {viewModel.TestParameters.Count}");
            return Json(Mapper.Map<SampleModel, SampleViewModel>(await sampleService.GetSample(id)));
        }

        [HttpGet("[controller]/{id:int}/Results")]
        public async Task<IActionResult> GetSampleAllTestResults(int id)
        {
            //sampleService.gettest
            return Json(Mapper.Map<SampleModel, SampleViewModel>(await sampleService.GetSample(id)));
        }

        [HttpGet("[controller]/TestParameter/{sampleTestParameterId:int}/Results")]
        public async Task<IActionResult> GetSampleTestResults(int sampleTestParameterId)
        {
            logger.LogWarning($"{sampleTestParameterId}");
            return Json( await Task.FromResult("") );
        }

        [HttpPost("[controller]/TestParameter/{sampleTestParameterId:int}/Result")]
        public async Task<IActionResult> SampleAddTestParameterResult([FromRoute]int sampleTestParameterId, [FromBody]string value)
        {
            logger.LogWarning($"SampleTestParameterId: {sampleTestParameterId} , Result: {value}");
            return Json( Mapper.Map<SampleTestParameterResultModel, SampleTestParameterResultBaseModel>(await sampleService.AddSampleTestResult(sampleTestParameterId, value)) );
        }

        [HttpPut("[controller]/TestParameter/Result")]
        public async Task<IActionResult> SampleEditTestParameterResult(SampleTestParameterResultBaseModel result)
        {
            return Json( await Task.FromResult("") );
        }


        /* Sample Test Parameters */
        [HttpGet("[controller]/{id:int}/TestParameters")]
        public async Task<IActionResult> GetSampleTestParameters(int id)
        {
            return Json(Mapper.Map<List<SampleTestParameterModel>, List<SampleTestParameterViewModel>>(await sampleService.GetSampleTestParameters(id)));
        }

        public IActionResult GetExcel()
        {
            using (var ms = new MemoryStream()) {

                IWorkbook workbook = new XSSFWorkbook();

                ISheet sheet1 = workbook.CreateSheet("Sheet1");

                sheet1.AddMergedRegion(new CellRangeAddress(0, 0, 0, 10));
                var rowIndex = 0;
                IRow row = sheet1.CreateRow(rowIndex);
                row.Height = 30 * 80;
                row.CreateCell(0).SetCellValue("this is content");
                sheet1.AutoSizeColumn(0);
                rowIndex++;

                var sheet2 = workbook.CreateSheet("Sheet2");
                var style1 = workbook.CreateCellStyle();
                style1.FillForegroundColor = HSSFColor.Blue.Index2;
                style1.FillPattern = FillPattern.SolidForeground;

                var style2 = workbook.CreateCellStyle();
                style2.FillForegroundColor = HSSFColor.Yellow.Index2;
                style2.FillPattern = FillPattern.SolidForeground;

                var cell2 = sheet2.CreateRow(0).CreateCell(0);
                cell2.CellStyle = style1;
                cell2.SetCellValue(0);

                cell2 = sheet2.CreateRow(1).CreateCell(0);
                cell2.CellStyle = style2;
                cell2.SetCellValue(1);

                workbook.Write(ms);

                //application/vnd.ms-excel
                return File( ms.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "test.xlsx" );
            }
        }
    }
}