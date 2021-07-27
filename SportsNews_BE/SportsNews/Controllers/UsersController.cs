using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using WebSportsEntity;

namespace SportsNews.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UsersController : ApiController
    {
        WebTheThaoEntities webTheThaoEntities = new WebTheThaoEntities();
        public IHttpActionResult Get()
        {
            var users = webTheThaoEntities.sp_get_all_users().ToList();
            if (users.Count == 0)
            {
                return NotFound();
            }
            return Ok(users);
        }

        public IHttpActionResult Get(string username, string password)
        {
            //var display = Userloginvalues().Where(m => m.UserName == objuserlogin.UserName && m.UserPassword == objuserlogin.UserPassword).FirstOrDefault();
            if (username == null || password == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trống"
                });
            }

            var login = webTheThaoEntities.sp_find_user_by_username(username).ToList();
            var objectlogin = login.Where(m => m.username == username).FirstOrDefault();

            if (objectlogin == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Tên tài khoản không tồn tại"
                });
            }
            else if (objectlogin != null && objectlogin.password != password)
            {
                return Ok(new
                {
                    result = -3,
                    message = "Mật khẩu không chính xác"
                });
            }
            else
            {
                objectlogin.password = null;
                return Ok(objectlogin);
            }
        }

        public IHttpActionResult Post([FromBody] user user)
        {
            if (user == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trống"
                });
            }
            
            var login = webTheThaoEntities.sp_find_user_by_username(user.username).ToList();
            var objectlogin = login.Where(m => m.username == user.username).FirstOrDefault();
            if (objectlogin != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Tên tài khoản đã tồn tại"
                });
            }
            else if (user.name == "" || user.password == "" || user.sdt == "" || user.email == "")
            {
                return Ok(new
                {
                    result = -3,
                    message = "Dữ liệu thiếu không thể thêm được vui lòng kiểm tra lại dữ liệu"
                });
            }
            else 
            {
                webTheThaoEntities.users.Add(user);
                webTheThaoEntities.SaveChanges();
                return Ok(new
                {
                    result = 1,
                    message = "Tạo tài khoản mới thành công"
                });
            }
        }
    }
}
