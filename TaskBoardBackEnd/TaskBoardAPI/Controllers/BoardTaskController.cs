using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Services;

namespace TaskBoardAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BoardTaskController : ControllerBase
    {
        private readonly IBoardTaskService boardTaskService;
        private readonly IMapper mapper;

        public BoardTaskController(IBoardTaskService boardTaskService, IMapper mapper)
        {
            this.boardTaskService = boardTaskService;
            this.mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BoardTaskDto>> GetTaskById(string id, CancellationToken cancellationToken)
        {
            BoardTask? boardTask = await boardTaskService.GetTaskByIdAsync(id, cancellationToken: cancellationToken);
            if (boardTask == null)
                return NotFound();
            BoardTaskDto boardTaskDto = mapper.Map<BoardTaskDto>(boardTask);
            return Ok(boardTaskDto);
        }

        [HttpPost]
        public async Task<ActionResult<BoardTaskDto>> CreateTask([FromBody] BoardTaskDto boardTaskDto, CancellationToken cancellationToken)
        {
            BoardTask boardTask = mapper.Map<BoardTask>(boardTaskDto);
            boardTask = await boardTaskService.CreateTaskAsync(boardTask, cancellationToken);
            boardTaskDto = mapper.Map<BoardTaskDto>(boardTask);
            return Ok(boardTaskDto);
        }
        [HttpPut]
        public async Task<ActionResult> UpdateBoardTask([FromBody] BoardTaskDto boardTaskDto, CancellationToken cancellationToken)
        {
            BoardTask boardTask = mapper.Map<BoardTask>(boardTaskDto);
            await boardTaskService.UpdateTaskAsync(boardTask, cancellationToken);
            return Ok();
        }
        [HttpDelete]
        public async Task<ActionResult> DeleteBoardTask([FromBody] BoardTaskDto boardTaskDto, CancellationToken cancellationToken)
        {
            BoardTask boardTask = mapper.Map<BoardTask>(boardTaskDto);
            await boardTaskService.DeleteTaskAsync(boardTask, cancellationToken);
            return Ok();
        }
    }
}
