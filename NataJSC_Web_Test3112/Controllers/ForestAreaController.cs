using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NataJSC_Web_Test3112.Data;
using NataJSC_Web_Test3112.Models;

namespace NataJSC_Web_Test3112.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ForestAreaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ForestAreaController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetForestAreas()
        {
            var list = await _context.ForestAreas
                .Include(f => f.LandOwner)
                .Select(f => new
                {
                    f.Id,
                    f.Code,
                    f.Name,
                    f.Area,
                    f.TreeType,
                    f.Location,
                    f.PlantYear,
                    f.Status,
                    LandOwnerName = f.LandOwner!.Name
                }).ToListAsync();
            return Ok(list);
        }
        //create forest area
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ForestArea dto)
        {
            bool forestAreaExits = await _context.ForestAreas.AnyAsync(f => f.Code == dto.Code);
            bool landOwnerExists = await _context.LandOwners.AnyAsync(lo => lo.Id == dto.LandOwnerId);
            if (forestAreaExits)
            {
                return BadRequest(new { Message = "Forest Area Code already exists." });
            }
            if (!landOwnerExists)
            {
                return BadRequest(new { Message = "Land Owner does not exist." });
            }
            var forestArea = new ForestArea
            {
                Code = dto.Code,
                Name = dto.Name,
                Area = dto.Area,
                TreeType = dto.TreeType,
                Location = dto.Location,
                PlantYear = dto.PlantYear,
                Status = dto.Status,
                LandOwnerId = dto.LandOwnerId,
                CreatedAt = DateTime.UtcNow
            };
            _context.ForestAreas.Add(forestArea);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Create Forest Area Complete!", Data = forestArea });
        }

        //update forest area
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] ForestArea dto)
        {
            var forestArea = await _context.ForestAreas.FindAsync(id);
            if (forestArea == null)
            {
                return NotFound(new { Message = "Forest Area not found." });
            }
            bool landOwnerExists = await _context.LandOwners.AnyAsync(lo => lo.Id == dto.LandOwnerId);
            if (!landOwnerExists)
            {
                return BadRequest(new { Message = "Land Owner does not exist." });
            }
            //check duplicate code
            bool duplicateCode = await _context.ForestAreas.AnyAsync(f => f.Code == dto.Code && f.Id != id);
            if (duplicateCode)
            {
                return BadRequest(new { Message = "Forest Area Code already exists." });
            }
            forestArea.Code = dto.Code;
            forestArea.Name = dto.Name;
            forestArea.Area = dto.Area;
            forestArea.TreeType = dto.TreeType;
            forestArea.Location = dto.Location;
            forestArea.PlantYear = dto.PlantYear;
            forestArea.Status = dto.Status;
            forestArea.LandOwnerId = dto.LandOwnerId;
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Update Forest Area Complete!", Data = forestArea });
        }

        //delete forest area
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteForestArea(int id)
        {
            var forestArea = await _context.ForestAreas.FindAsync(id);
            if (forestArea == null)
            {
                return NotFound("Forest Area not found.");
            }
            _context.ForestAreas.Remove(forestArea);
            await _context.SaveChangesAsync();
            return Ok("Forest Area deleted successfully.");
        }
    }
}
