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
    public class CategoryController : ApiController
    {
        WebTheThaoEntities WebTheThaoEntities = new WebTheThaoEntities();
        public IHttpActionResult Get()
        {
            var category = WebTheThaoEntities.sp_get_all_category_article().ToList();
            if (category.Count == 0)
            {
                return NotFound();
            }
            return Ok(category);
        }

        public IHttpActionResult Post([FromBody] category category)
        {
            if (category == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trống"
                });
            }
            if(category.name_category == "")
            {
                return Ok(new
                {
                    result = -3,
                    message = "Dữ liệu thiếu vui lòng kiểm tra lại dữ liệu"
                });
            }
            WebTheThaoEntities.categories.Add(category);
            WebTheThaoEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Thêm danh mục thành công"
            });
        }

        public IHttpActionResult Put([FromBody] category category)
        {
            var cate = WebTheThaoEntities.categories.Find(category.id_category);

            if (cate == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không tìm thấy bài báo"
                });
            }
            if (category.name_category == "")
            {
                return Ok(new
                {
                    result = -3,
                    message = "Dữ liệu thiếu vui lòng kiểm tra lại dữ liệu"
                });
            }
            cate.name_category = category.name_category;

            WebTheThaoEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Sửa danh mục thành công"
            });
        }

        public IHttpActionResult Delete(int id)
        {
            var cate = WebTheThaoEntities.categories.Find(id);
            if (cate == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không tìm thấy danh mục"
                });
            }
            var articles = WebTheThaoEntities.sp_get_all_article_by_category(id).ToList();
            if (articles.Count > 0)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Danh mục này đang có bài báo sử dụng không xóa được"
                });
            }
            WebTheThaoEntities.categories.Remove(cate);
            WebTheThaoEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Xóa thành công danh mục"
            });
        }
    }
}
