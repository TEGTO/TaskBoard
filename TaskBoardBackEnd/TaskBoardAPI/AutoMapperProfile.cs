using AutoMapper;
using Microsoft.Extensions.Hosting;
using System.Text.RegularExpressions;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPI
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            CreateMap<BoardTaskList, BoardTaskListDto>();
            CreateMap<BoardTaskListDto, BoardTaskList>();
            CreateMap<BoardTask, BoardTaskDto>();
            CreateMap<BoardTaskDto, BoardTask>();
            CreateMap<BoardTaskActivity, BoardTaskActivityDto>();
            CreateMap<BoardTaskActivityDto, BoardTaskActivity>();
            CreateMap<BoardActivity, BoardActivityDto>();
            CreateMap<BoardActivityDto, BoardActivity>();
        }
    }
}
