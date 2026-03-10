// 전북특별자치도 전주시_실시간 운행정보 서비스
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
    const url = `https://openapi.jeonju.go.kr/jeonjubus/openApi/traffic` +
      `?ServiceKey=${encodeURIComponent(API_KEY)}` +
      `&stopStdid=${stationId}` +
      `&_type=json`;

    const response = await fetch(url);
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({ error: 'API 응답이 JSON이 아닙니다.', raw: text.slice(0, 500) });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
