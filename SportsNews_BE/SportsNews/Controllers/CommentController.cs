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
    public class CommentController : ApiController
    {
        WebTheThaoEntities WebTheThaoEntities = new WebTheThaoEntities();
        public IHttpActionResult Post([FromBody] Comment comment)
        {
            if (comment.id_article ==null || comment.id_user == null || comment.comment_content == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trống"
                });
            }
            if (comment.comment_content == "")
            {
                return Ok(new
                {
                    result = -3,
                    message = "Dữ liệu thiếu vui lòng kiểm tra lại dữ liệu"
                });
            }

            var user = WebTheThaoEntities.users.Find(comment.id_user);
            var article = WebTheThaoEntities.Articles.Find(comment.id_article);

            if(user == null || article == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Không có bài báo hoặc user không tồn tại"
                });
            }

            WebTheThaoEntities.Comments.Add(comment);
            WebTheThaoEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Thêm thành công"
            });
        }
    }
}
