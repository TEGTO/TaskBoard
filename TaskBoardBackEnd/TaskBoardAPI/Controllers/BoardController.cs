using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Models;
using TaskBoardAPI.Services;

namespace TaskBoardAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BoardController : ControllerBase
    {
        private readonly IBoardService boardService;
        private readonly IMapper mapper;

        public BoardController(IBoardService boardService, IMapper mapper)
        {
            this.boardService = boardService;
            this.mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BoardDto>> GetBoardById(string id, CancellationToken cancellationToken)
        {
            Board? board = await boardService.GetBoardByIdAsync(id, cancellationToken: cancellationToken);
            if (board == null)
                return NotFound();
            BoardDto boardDto = mapper.Map<BoardDto>(board);
            return Ok(boardDto);
        }
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<BoardDto>>> GetBoardsByUserId(string userId, CancellationToken cancellationToken)
        {
            IEnumerable<Board> boards = await boardService.GetBoardsByUserIdAsync(userId, cancellationToken: cancellationToken);
            return Ok(boards.Select(mapper.Map<BoardDto>));
        }
        [HttpGet("amount/tasklists/{id}")]
        public async Task<ActionResult<int>> GetBoardTaskListsAmountByBoardId(string id, CancellationToken cancellationToken)
        {
           int amount = await boardService.GetTaskListsAmountAsync(id, cancellationToken: cancellationToken);
            return Ok(amount);
        }
        [HttpGet("amount/tasks/{id}")]
        public async Task<ActionResult<int>> GetBoardTasksAmountByBoardId(string id, CancellationToken cancellationToken)
        {
            int amount = await boardService.GetTasksAmountAsync(id, cancellationToken: cancellationToken);
            return Ok(amount);
        }
        [HttpPost]
        public async Task<ActionResult<BoardDto>> CreateBoard([FromBody] BoardDto boardDto, CancellationToken cancellationToken)
        {
            Board board = mapper.Map<Board>(boardDto);
            board = await boardService.CreateBoardAsync(board, cancellationToken);
            boardDto = mapper.Map<BoardDto>(board);
            return Ok(boardDto);
        }
        [HttpPut]
        public async Task<ActionResult> UpdateBoard([FromBody] BoardDto boardDto, CancellationToken cancellationToken)
        {
            Board board = mapper.Map<Board>(boardDto);
            await boardService.UpdateBoardAsync(board, cancellationToken);
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBoard(string id, CancellationToken cancellationToken)
        {
            await boardService.DeleteBoardAsync(id, cancellationToken);
            return Ok();
        }
    }
}
