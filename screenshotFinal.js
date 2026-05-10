const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const filePath = 'file:///' + path.resolve(__dirname, 'index.html').split('\\').join('/');

  // ---- DESKTOP 1440x900 ----
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Hero + brand strip
  await page.screenshot({ path: 'ss_01_hero.png' });

  // 2. Scroll to brand strip area
  await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'ss_02_brand_strip.png' });

  // 3. Funcionalidades
  await page.evaluate(() => document.getElementById('funcionalidades').scrollIntoView());
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'ss_03_funcionalidades.png' });

  // 4. Equipo section
  await page.evaluate(() => document.getElementById('equipo').scrollIntoView());
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'ss_04_equipo.png' });

  // 5. Contacto + form
  await page.evaluate(() => document.getElementById('contacto').scrollIntoView());
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'ss_05_contacto.png' });

  // 6. Login modal
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 300));
  await page.evaluate(() => openLoginModal());
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'ss_06_login.png' });

  // 7. Login → Dashboard Panel
  await page.evaluate(() => {
    document.getElementById('loginEmail').value = 'admin@textilsmart.com';
    document.getElementById('loginPassword').value = 'demo1234';
    handleLogin();
  });
  await new Promise(r => setTimeout(r, 1800));
  await page.screenshot({ path: 'ss_07_panel.png' });

  // Scroll panel down to OT table
  const appContent = await page.$('#appContent');
  await appContent.evaluate(el => el.scrollTop = 600);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'ss_08_panel_ots.png' });
  await appContent.evaluate(el => el.scrollTop = 0);

  // 8. Tab Activos
  await page.evaluate(() => showTab('activos'));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'ss_09_tab_activos.png' });

  // 9. Tab OTs
  await page.evaluate(() => showTab('ots'));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'ss_10_tab_ots.png' });

  // 10. Tab Inventario
  await page.evaluate(() => showTab('inventario'));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'ss_11_tab_inventario.png' });

  // 11. Tab QR
  await page.evaluate(() => showTab('qr'));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'ss_12_tab_qr.png' });

  // 12. Tab Planta
  await page.evaluate(() => showTab('planta'));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'ss_13_tab_planta.png' });

  // ---- MOBILE 390x844 ----
  const mob = await browser.newPage();
  await mob.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await mob.goto(filePath, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // Mobile hero
  await mob.screenshot({ path: 'ss_m01_hero.png' });

  // Mobile login + dashboard
  await mob.evaluate(() => openLoginModal());
  await new Promise(r => setTimeout(r, 600));
  await mob.evaluate(() => {
    document.getElementById('loginEmail').value = 'admin@textilsmart.com';
    document.getElementById('loginPassword').value = 'demo1234';
    handleLogin();
  });
  await new Promise(r => setTimeout(r, 1800));
  await mob.screenshot({ path: 'ss_m02_panel.png' });

  // Mobile tab bar visible
  await mob.evaluate(() => showTab('activos'));
  await new Promise(r => setTimeout(r, 500));
  await mob.screenshot({ path: 'ss_m03_activos.png' });

  await mob.evaluate(() => showTab('planta'));
  await new Promise(r => setTimeout(r, 500));
  await mob.screenshot({ path: 'ss_m04_planta.png' });

  await browser.close();
  console.log('✓ Screenshots completados: ss_01_hero.png → ss_m04_planta.png');
})();
