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
    public class LandOwnerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public LandOwnerController(ApplicationDbContext context)
        {
            _context = context;
        }

        //Get all L.o
        [HttpGet]
        public async Task<IActionResult> GetLandOwners()
        {
            var landOwners = await _context.LandOwners
                .Select(lo => new
                {
                    lo.Id,
                    lo.Name,
                    lo.Phone,
                    lo.Email,
                    lo.Address,
                    lo.Note
                })
                .ToListAsync();
            return Ok(landOwners);
        }

        //Create L.o
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateLandOwner([FromBody] LandOwner newLandOwner)
        {
            _context.LandOwners.Add(newLandOwner);
            await _context.SaveChangesAsync();
            return Ok("Land Owner created successfully.");
        }

        //Update L.o
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateLandOwner(int id, [FromBody] LandOwner updatedLandOwner)
        {
            var landOwner = await _context.LandOwners.FindAsync(id);
            if (landOwner == null)
            {
                return NotFound("Land Owner not found.");
            }
            landOwner.Name = updatedLandOwner.Name;
            landOwner.Phone = updatedLandOwner.Phone;
            landOwner.Email = updatedLandOwner.Email;
            landOwner.Address = updatedLandOwner.Address;
            landOwner.Note = updatedLandOwner.Note;
            await _context.SaveChangesAsync();
            return Ok("Land Owner updated successfully.");
        }

        //Delete L.o
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteLandOwner(int id)
        {
            var landOwner = await _context.LandOwners.FindAsync(id);
            if (landOwner == null)
            {
                return NotFound("Land Owner not found.");
            }
            _context.LandOwners.Remove(landOwner);
            await _context.SaveChangesAsync();
            return Ok("Land Owner deleted successfully.");
        }
    }
}
