// Vercel Serverless Function - 공공 API 프록시 (CORS 해결)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { stationId } = req.query;

  if (!stationId) {
    return res.status(400).json({ error: '정류장 ID가 필요합니다.' });
  }

  const API_KEY = process.env.BUS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API 키가 서버에 설정되지 않았습니다.' });
  }

  try {
    // url.parse() 대신 URLSearchParams 사용 (Node.js 최신 방식)
    const params = new URLSearchParams({
      serviceKey: API_KEY,
      cityCode: '35010',
      nodeId: stationId,
      numOfRows: '20',
      pageNo: '1',
      _type: 'json',
    });

    const url = `https://apis.data.go.kr/1613000/ArvlInfoInqireForStation01/getSttnAcctoArvlPrearngeInfoList?${params.toString()}`;

    const response = await fetch(url);
    const text = await response.text();

    // JSON 파싱 전에 텍스트로 먼저 받아서 디버깅
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // JSON이 아닌 경우 원문 반환 (디버깅용)
      return res.status(500).json({ error: 'API 응답이 JSON이 아닙니다.', raw: text.slice(0, 300) });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
