process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';//設置為 0 意味著 node.js 不會驗證 SSL/TLS 證書是否具有通往受信任“根”證書的正確且完整的路徑
const axios = require('axios');

const doRequset = async () => {
    const headers = { 'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzcyYWVkMjIxYTgzY2QzNzk4Mzk0YiIsImVtYWlsIjoiYXF3ZUBnZy5jb20iLCJzdGF0dXMiOiJpbmFjdGl2ZSIsImlhdCI6MTY5MDc3NDI1MywiZXhwIjoxNzc3MTc0MjUzfQ.lHoMiRLyVfg6P0ty4dtYk8ztIgDT3GW4_HeOsfcYaDQ' };

    const {data} = await axios.post(
        'https://geetogether.dev/api/profiles/',
        {
            name: "tom5",
            age: 0,
            gender: "male",
            zodiacSign: "Aries",
            myTags: ["1", "2"]
        },
        {
            headers
        }
    );

    console.log(data.result);
    const insertedId = data.result


    await axios.put(
        'https://geetogether.dev/api/profiles/me/name/',
        {
            id: insertedId,
            name: "tom10"
        },
        {
            headers
        }
    );


    await axios.put(
        'https://geetogether.dev/api/profiles/me/name/',
        {
            id: insertedId,
            name: "tom15"
        },
        {
            headers
        }
    );

    console.log('Request complete')
}


(async () => {
    for (let i = 0; i < 400; i++) {
    doRequset();
    }
})()