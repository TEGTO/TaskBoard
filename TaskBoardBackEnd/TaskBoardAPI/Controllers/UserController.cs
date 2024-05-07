using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Services;

namespace TaskBoardAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IMapper mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            this.userService = userService;
            this.mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(string id, CancellationToken cancellationToken)
        {
            User? user = await userService.GetUserByIdAsync(id, cancellationToken: cancellationToken);
            if (user == null)
                return NotFound();
            UserDto userDto = mapper.Map<UserDto>(user);
            return Ok(userDto);
        }
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] UserDto userDto, CancellationToken cancellationToken)
        {
            User user = mapper.Map<User>(userDto);
            await userService.CreateNewUserAsync(user, cancellationToken);
            userDto = mapper.Map<UserDto>(user);
            return Ok(userDto);
        }
    }
}
