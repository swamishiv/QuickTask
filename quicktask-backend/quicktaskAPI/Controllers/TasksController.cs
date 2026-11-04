
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quicktaskAPI.Data;
using quicktaskAPI.Models;

namespace quicktaskAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        private bool TryGetUserId(out int userId)
        {
            return int.TryParse(
                User.FindFirstValue(ClaimTypes.NameIdentifier),
                out userId);
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized();

            var tasks = await _context.Tasks
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(tasks);
        }

        // GET: api/tasks/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TaskItem>> GetTask(int id)
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized();

            var task = await _context.Tasks
                .FirstOrDefaultAsync(t =>
                    t.Id == id && t.UserId == userId);

            if (task == null)
                return NotFound();

            return Ok(task);
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(task.Title))
                return BadRequest("Task title is required.");

            task.Id = 0;
            task.Title = task.Title.Trim();
            task.IsCompleted = false;
            task.CreatedAt = DateTime.UtcNow;

            // Never trust a client-supplied owner ID.
            task.UserId = userId;

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetTask),
                new { id = task.Id },
                task);
        }

        // PUT: api/tasks/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateTask(
            int id,
            TaskItem updatedTask)
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(updatedTask.Title))
                return BadRequest("Task title is required.");

            var task = await _context.Tasks
                .FirstOrDefaultAsync(t =>
                    t.Id == id && t.UserId == userId);

            if (task == null)
                return NotFound();

            task.Title = updatedTask.Title.Trim();
            task.IsCompleted = updatedTask.IsCompleted;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/tasks/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized();

            var task = await _context.Tasks
                .FirstOrDefaultAsync(t =>
                    t.Id == id && t.UserId == userId);

            if (task == null)
                return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
