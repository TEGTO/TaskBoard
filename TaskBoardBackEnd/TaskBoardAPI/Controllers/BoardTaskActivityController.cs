using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Services;

namespace TaskBoardAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BoardTaskActivityController : ControllerBase
    {
        private readonly IBoardTaskActivityService boardTaskActivityService;
        private readonly IMapper mapper;

        public BoardTaskActivityController(IBoardTaskActivityService boardTaskActivityService, IMapper mapper)
        {
            this.boardTaskActivityService = boardTaskActivityService;
            this.mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BoardTaskActivityDto>> GetBoardTaskActivityById(string id, CancellationToken cancellationToken)
        {
            BoardTaskActivity? boardTaskActivity = await boardTaskActivityService.GetTaskActivityByIdAsync(id, cancellationToken: cancellationToken);
            if (boardTaskActivity == null)
                return NotFound();
            BoardTaskActivityDto boardTaskActivityDto = mapper.Map<BoardTaskActivityDto>(boardTaskActivity);
            return Ok(boardTaskActivityDto);
        }
        [HttpGet("taskActivities/{taskId}")]
        public async Task<ActionResult<IEnumerable<BoardTaskActivityDto>>> GetBoardTaskActivitiesByTaskId(string taskId, CancellationToken cancellationToken)
        {
            IEnumerable<BoardTaskActivity> boardTaskActivities = await boardTaskActivityService.GetTaskActivitiesByTaskIdAsync(taskId, cancellationToken);
            if (boardTaskActivities == null)
                return NotFound();
            return Ok(boardTaskActivities.Select(mapper.Map<BoardTaskActivityDto>));
        }
        [HttpPost]
        public async Task<ActionResult<BoardTaskActivityDto>> CreateBoardTaskActivity([FromBody] BoardTaskActivityDto boardTaskActivityDto, CancellationToken cancellationToken)
        {
            BoardTaskActivity boardTaskActivity = mapper.Map<BoardTaskActivity>(boardTaskActivityDto);
            boardTaskActivity = await boardTaskActivityService.CreateTaskBoardActivityAsync(boardTaskActivity, cancellationToken);
            boardTaskActivityDto = mapper.Map<BoardTaskActivityDto>(boardTaskActivity);
            return Ok(boardTaskActivityDto);
        }
    }
}
