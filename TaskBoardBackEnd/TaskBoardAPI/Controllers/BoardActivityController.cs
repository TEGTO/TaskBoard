using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Services;

namespace TaskBoardAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BoardActivityController : ControllerBase
    {
        private readonly IBoardActivityService boardActivityService;
        private readonly IMapper mapper;

        public BoardActivityController(IBoardActivityService boardActivityService, IMapper mapper)
        {
            this.boardActivityService = boardActivityService;
            this.mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BoardActivityDto>> GetBoardActivityById(string id, CancellationToken cancellationToken)
        {
            BoardActivity? boardActivity = await boardActivityService.GetActivityByIdAsync(id, cancellationToken: cancellationToken);
            if (boardActivity == null)
                return NotFound();
            BoardActivityDto boardActivityDto = mapper.Map<BoardActivityDto>(boardActivity);
            return Ok(boardActivityDto);
        }
        [HttpGet("board/{boardId}/amount")]
        public async Task<ActionResult<int>> GetBoardActivityAmount(string boardId, CancellationToken cancellationToken)
        {
            int amount = await boardActivityService.GetBoardActivityAmountByBoardIdAsync(boardId, cancellationToken);
            return Ok(amount);
        }
        [HttpGet("board/{boardId}/onpage")]
        public async Task<ActionResult<IEnumerable<BoardActivityDto>>> GetBoardActivityOnPage(string boardId,
            [FromQuery] int page, [FromQuery] int amountOnPage, CancellationToken cancellationToken)
        {
            IEnumerable<BoardActivity> boardActivities = await boardActivityService.GetActivitiesOnPageByBoardIdAsync(boardId, page, amountOnPage, cancellationToken);
            return Ok(boardActivities.Select(mapper.Map<BoardActivityDto>));
        }
        [HttpPost]
        public async Task<ActionResult<BoardActivityDto>> CreateBoardActivity([FromBody] BoardActivityDto boardActivityDto, CancellationToken cancellationToken)
        {
            BoardActivity boardActivity = mapper.Map<BoardActivity>(boardActivityDto);
            boardActivity = await boardActivityService.CreateBoardActivityAsync(boardActivity, cancellationToken);
            boardActivityDto = mapper.Map<BoardActivityDto>(boardActivity);
            return Ok(boardActivityDto);
        }
    }
}