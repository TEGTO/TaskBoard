using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Services;

namespace TaskBoardAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BoardTaskListController : ControllerBase
    {
        private readonly IBoardTaskListService boardTaskListService;
        private readonly IMapper mapper;

        public BoardTaskListController(IBoardTaskListService boardTaskListService, IMapper mapper)
        {
            this.boardTaskListService = boardTaskListService;
            this.mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BoardTaskListDto>> GetTaskListById(string id, CancellationToken cancellationToken)
        {
            BoardTaskList? boardTaskList = await boardTaskListService.GetTaskListByIdAsync(id, cancellationToken: cancellationToken);
            if (boardTaskList == null)
                return NotFound();
            BoardTaskListDto boardTaskListDto = mapper.Map<BoardTaskListDto>(boardTaskList);
            return Ok(boardTaskListDto);
        }
        [HttpGet("board/{boardId}")]
        public async Task<ActionResult<IEnumerable<BoardTaskListDto>>> GetTaskListsByBoardId(string boardId, CancellationToken cancellationToken)
        {
            IEnumerable<BoardTaskList> boardTaskLists = await boardTaskListService.GetTaskListsByBoardIdAsync(boardId, cancellationToken: cancellationToken);
            return Ok(boardTaskLists.Select(mapper.Map<BoardTaskListDto>));
        }
        [HttpPost]
        public async Task<ActionResult<BoardTaskListDto>> CreateTaskList([FromBody] BoardTaskListDto boardTaskListDto, CancellationToken cancellationToken)
        {
            BoardTaskList boardTaskList = mapper.Map<BoardTaskList>(boardTaskListDto);
            boardTaskList = await boardTaskListService.CreateTaskListAsync(boardTaskList, cancellationToken);
            boardTaskListDto = mapper.Map<BoardTaskListDto>(boardTaskList);
            return Ok(boardTaskListDto);
        }
        [HttpPut]
        public async Task<ActionResult> UpdateTaskList([FromBody] BoardTaskListDto boardTaskListDto, CancellationToken cancellationToken)
        {
            BoardTaskList boardTaskList = mapper.Map<BoardTaskList>(boardTaskListDto);
            await boardTaskListService.UpdateTaskListAsync(boardTaskList, cancellationToken);
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTaskList(string id, CancellationToken cancellationToken)
        {
            await boardTaskListService.DeleteTaskListAsync(id, cancellationToken);
            return Ok();
        }
    }
}
