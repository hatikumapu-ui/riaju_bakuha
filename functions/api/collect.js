// functions/api/collect.js の中身
export async function onRequest(context) {
  const { request } = context;

  const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
  const country = request.headers.get('cf-ipcountry') || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';

  let screenSize = 'unknown';
  try {
    const body = await request.json();
    if (body && body.screenSize) {
      screenSize = body.screenSize;
    }
  } catch (e) {}

  const visitorData = {
    ip: clientIp,
    country: country,
    screenSize: screenSize,
    userAgent: userAgent,
  };

  // あなたのGASのウェブアプリURLに書き換え
  const GAS_URL = 'https://script.google.com/macros/library/d/1RN0Qq5CWMLQU_phjVHAYz6DEURPdwX8Q6-PZaK6XpEsMX06WVDAHcs9s/2';

  try {
    await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitorData),
    });
  } catch (e) {
    console.error('GASへの送信に失敗しました:', e);
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  });
}
