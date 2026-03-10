// Vercel Serverless Function - 공공 API 프록시 (CORS 해결)
export default async function handler(req, res) {
  // CORS 허용
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { stationId } = req.query;

  if (!stationId) {
    return res.status(400).json({ error: '정류장 ID가 필요합니다.' });
  }

  // API 키는 Vercel 환경 변수에서 불러옴 (절대 코드에 직접 넣지 않음)
  const API_KEY = process.env.BUS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API 키가 서버에 설정되지 않았습니다.' });
  }

  try {
    const url = `https://apis.data.go.kr/1613000/ArvlInfoInqireForStation01/getSttnAcctoArvlPrearngeInfoList` +
      `?serviceKey=${API_KEY}` +
      `&cityCode=35010` +
      `&nodeId=${stationId}` +
      `&numOfRows=20` +
      `&pageNo=1` +
      `&_type=json`;

    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
