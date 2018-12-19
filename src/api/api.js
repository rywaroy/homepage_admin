export default {
  login: '/admin/login',
  article_list: '/article',
  article_top: '/article/top',
  article_delete: '/article/',
  article_tag: '/article/tag',
  article_tag_delete: '/article/tag/',
  article_add: '/article',
  article_info: '/article/',
  article_update: '/article/',
  learn_list: '/learn',
  learn_delete: '/learn/',
  learn_add: '/learn',
  learn_info: '/learn/',
  learn_update: '/learn/update',
  album_list: '/album',
  album_delete: '/album/',
  album_group(id) {
    return `/album/${id}/group`;
  },
  album_group_delete: '/album/group/',
  think_list: '/think',
  think_delete: '/think/',
  think_info: '/think/',
  think_add: '/think',
  think_edit: '/think/',
  base_visit: '/base/visit',
};
