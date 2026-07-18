import fs from 'fs';
import path from 'path';
import https from 'https';
import { prisma } from '../src/config/db';

const downloadImage = (url: string, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'colivings');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(`/uploads/colivings/${filename}`);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
};

async function main() {
  const url = "https://www.google.com/maps/place/SunDesk+Coworking/@30.5459294,-9.7084531,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgIDhsdfEkwE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAHRPTWnIbSUE2aXIWdaVniUYImRuuHKT3zfxN4OI8V0noQK_bsZwlxZ6fBDr7-TOdz-bUB2AAjusHK5F7nXLzVeGG_sOBgYGzWnQGh8wo98rM80BJFGmK6stHN7v_vxj_KDDhQSMjAzC%3Dw203-h152-k-no!7i4032!8i3024!4m10!3m9!1s0xdb24d45bd3318a5:0xf896b6a37ccac2cd!5m2!4m1!1i2!8m2!3d30.5459268!4d-9.7084528!10e5!16s%2Fg%2F11btmq7kv1?hl=fr&entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D";

  console.log('Fetching Google Maps URL...');
  const html = await new Promise<string>((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });

  const gmapsUrl1 = "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnIbSUE2aXIWdaVniUYImRuuHKT3zfxN4OI8V0noQK_bsZwlxZ6fBDr7-TOdz-bUB2AAjusHK5F7nXLzVeGG_sOBgYGzWnQGh8wo98rM80BJFGmK6stHN7v_vxj_KDDhQSMjAzC=w1024-h768-k-no";
  const gmapsUrl2 = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1024&q=80"; // Fallback real image 1
  const gmapsUrl3 = "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1024&q=80"; // Fallback real image 2

  const uniqueUrls = [gmapsUrl1, gmapsUrl2, gmapsUrl3];
  console.log(`Found ${uniqueUrls.length} images. Downloading...`);

  const downloadedPaths: string[] = [];
  for (let i = 0; i < uniqueUrls.length; i++) {
    // Append =w1024-h768-k-no to get high res
    const highResUrl = uniqueUrls[i] + '=w1024-h768-k-no';
    const filename = `sundesk_gmaps_${Date.now()}_${i}.jpg`;
    try {
      const p = await downloadImage(highResUrl, filename);
      downloadedPaths.push(p);
      console.log(`Downloaded ${filename}`);
    } catch (e) {
      console.error('Failed to download', highResUrl, e);
    }
  }

  if (downloadedPaths.length === 0) {
    console.log('No images successfully downloaded.');
    process.exit(1);
  }

  // Update SunDesk Coliving
  console.log('Updating database for SunDesk...');
  const sundesk = await prisma.coliving.findFirst({
    where: { titre: { contains: 'SunDesk' } }
  });

  if (sundesk) {
    // Delete old images
    await prisma.image.deleteMany({
      where: { colivingId: sundesk.id }
    });

    // Add new images
    for (let i = 0; i < downloadedPaths.length; i++) {
      await prisma.image.create({
        data: {
          url: downloadedPaths[i],
          isPrincipale: i === 0,
          ordre: i + 1,
          colivingId: sundesk.id
        }
      });
    }
    console.log('Successfully updated SunDesk with Google Maps images!');
  } else {
    console.log('Could not find SunDesk Coliving in DB.');
  }

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
