import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDiscList() {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  // 因为歌单数据获取的时候需要qq音乐对应的host和renfer，jsonp的获取方式不可行，这里利用axios模拟qq音乐客户端
  // 利用服务器代理的方式获取歌单列表数据
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// export function getSongList(disstid) {
//   const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
//
//   const data = Object.assign({}, commonParams, {
//     disstid,
//     type: 1,
//     json: 1,
//     utf8: 1,
//     onlysong: 0,
//     platform: 'yqq',
//     hostUin: 0,
//     needNewCode: 0
//   })
//
//   return jsonp(url, data, options)
// }
export function getSongList() {
  const url = '/api/getSongList'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    new_format: 1,
    pic: 500,
    disstid: 4182163707,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    picmid: 1,
    nosign: 1,
    song_begin: 0,
    song_num: 15
  })
  // 因为歌单数据获取的时候需要qq音乐对应的host和renfer，jsonp的获取方式不可行，这里利用axios模拟qq音乐客户端
  // 利用服务器代理的方式获取歌单列表数据
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
