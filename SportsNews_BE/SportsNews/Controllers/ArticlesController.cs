using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using WebSportsEntity;
using System.Collections.Generic;

using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System.IO;

namespace SportsNews.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ArticlesController : ApiController
    {
        WebTheThaoEntities WebTheThaoEntities = new WebTheThaoEntities();



        static Account account = new Account( "pnam1609","374845767221635","9ujinxMeC0YPZCLaEpwSB8QiO1E");
        Cloudinary cloudinary = new Cloudinary(account);

        public IHttpActionResult Get()
        {
            var articles = WebTheThaoEntities.sp_get_article_and_category1().ToList();
            if (articles.Count == 0)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có bài báo nào"
                });
            }
            return Ok(articles);
        }
        public IHttpActionResult Get(int id)
        {
            var article = WebTheThaoEntities.Articles.Find(id);
            if (article == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có bài báo nào"
                });
            }
            var res = new
            {
                id_article = article.id_article,
                nameArticle = article.nameArticle,
                author = article.author,
                datetime_article = article.datetime_article,
                contentArticle = article.contentArticle,
                desciption = article.desciption,
                img = article.img,
                views = article.views,
                category = new
                {
                    id_category = article.category.id_category,
                    name_category = article.category.name_category
                },
                comments = article.Comments.Select(comment =>
                new
                {
                    id_comment = comment.id_comment,
                    comment_content = comment.comment_content,
                    user = new
                    {
                        id_user = comment.user.id_user,
                        username = comment.user.username,
                        password = comment.user.password,
                        name = comment.user.name,
                        sdt = comment.user.sdt,
                        email = comment.user.email
                    }
                })
            };
            return Ok(res);

        }

        public IHttpActionResult GetArticleByCategory(int id_category)
        {
            //var articles = WebTheThaoEntities.sp_get_all_article_by_category(id_category).ToList();
            var articles = WebTheThaoEntities.sp_get_article_by_category_1(id_category).ToList();


            if (articles.Count == 0)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có bài báo nào"
                });
            }


            return Ok(articles);
        }

        public IHttpActionResult Post([FromBody] Article article)
        {
            Console.WriteLine(article);
            if (article == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trống"
                });
            }
            var category = WebTheThaoEntities.categories.Find(article.id_category);
            if (category == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Danh mục này hiện không có không thể thêm bài báo"
                });
            }
            if (article.author == "" || article.desciption == "" || article.img == "" || article.nameArticle == "" || article.datetime_article == null || article.contentArticle == "")
            {
                return Ok(new
                {
                    result = -3,
                    message = "Dữ liệu thiếu vui lòng kiểm tra lại dữ liệu"
                });
            }
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(article.img)
            };

            var uploadResult = cloudinary.Upload(uploadParams);
            article.img = uploadResult.Url.ToString();

            WebTheThaoEntities.Articles.Add(article);
            

            WebTheThaoEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Thêm bài báo thành công"
            });


        }
        

        public IHttpActionResult Put([FromBody] Article article)
        {
            var art = WebTheThaoEntities.Articles.Find(article.id_article);

            if (art == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không tìm thấy bài báo"
                });
            }
            var category = WebTheThaoEntities.categories.Find(article.id_category);
            if (category == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Danh mục này hiện không có không thể thêm bài báo"
                });
            }
            if (article.author == "" || article.desciption == "" || article.img == "" || article.nameArticle == "" || article.datetime_article == null || article.contentArticle == "")
            {
                return Ok(new
                {
                    result = -3,
                    message = "Dữ liệu thiếu vui lòng kiểm tra lại dữ liệu"
                });
            }
            //var uploadParams = new ImageUploadParams()
            //{
            //    File = new FileDescription(article.img)
            //};
            //var uploadResult = cloudinary.Upload(uploadParams);
            //art.img = uploadResult.Url.ToString();

            if (art.img != article.img)
            {
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(article.img)
                };
                var uploadResult = cloudinary.Upload(uploadParams);
                art.img = uploadResult.Url.ToString();
            }



            art.nameArticle = article.nameArticle;
            art.author = article.author;
            art.datetime_article = article.datetime_article;
            art.contentArticle = article.contentArticle;
            art.desciption = article.desciption;
            //art.img = article.img;
            art.views = article.views;
            art.id_category = article.id_category;

            WebTheThaoEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Sửa bài báo thành công"
            });
        }

        public IHttpActionResult Delete(int id)
        {
            var art = WebTheThaoEntities.Articles.Find(id);
            var cmt = WebTheThaoEntities.sp_filter_cmt_article(id).ToList();
            // Console.WriteLine(cmt);

            foreach (sp_filter_cmt_article_Result comment in cmt)
            {
                var comment_delete = WebTheThaoEntities.Comments.Find(comment.id_comment);

                WebTheThaoEntities.Comments.Remove(comment_delete);
            }
            if (art == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không tìm thấy bài báo"
                });
            }
            WebTheThaoEntities.Articles.Remove(art);
            WebTheThaoEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Xóa thành công bài báo"
            });
        }


       
    }
}
