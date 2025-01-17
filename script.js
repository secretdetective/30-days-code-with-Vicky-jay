function writeText(text) {
  let index = 0;

  function writeNextLetter() {
    if (index < text.length) {
      document.getElementById('head').innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }
  let interval = setInterval(writeNextLetter, 100);
}
writeText('Please fill out the fields below.');

document.getElementById('registration-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const spinner = document.getElementById('spinner');
  spinner.style.display = 'block';

  const form = event.target;
  const formData = new FormData(form);

  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value.trim().toLowerCase();
  });

  await generateCertificate(formData);
  spinner.style.display = 'none';
});

async function generateCertificate(formData) {
  const name = formData.get('Name');
  const institution = formData.get('Name of Institution');
  const regNumber = formData.get('Reg Number');
  const department = formData.get('Department');
  const cgpa = parseFloat(formData.get('CGPA') || 0);

  let grade;
  if (cgpa >= 4.5 && cgpa <= 5) {
    grade = 'First Class Honours';
  } else if (cgpa >= 3.5 && cgpa < 4.5) {
    grade = 'Second Class Upper';
  } else if (cgpa >= 2.5 && cgpa < 3.5) {
    grade = 'Second Class Lower';
  } else if (cgpa >= 0 && cgpa < 2.5) {
    grade = 'Third Class';
  } else {
    grade = 'Pass';
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape');
  const img = await getImageData('ese.jpg');

  doc.addImage(img, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
  doc.setFont('helvetica');

  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(184, 134, 11);
  doc.text(`${institution.toUpperCase()}`, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('Certificate of Completion', doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });

  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  doc.text(`${name}`, doc.internal.pageSize.getWidth() / 2, 80, { align: 'center' });

  doc.setFontSize(15);
  doc.setTextColor(128, 128, 128);
  doc.text(`${regNumber}`, doc.internal.pageSize.getWidth() / 2, 90, { align: 'center' });

  doc.setLineWidth(2);
  doc.setDrawColor(184, 134, 11);
  doc.line(
    doc.internal.pageSize.getWidth() / 2 - 90,
    95,
    doc.internal.pageSize.getWidth() / 2 + 90,
    95
  );

  doc.setFontSize(18);
  doc.text(
    `Completed the approved course of study and fulfilled all the prescribed conditions in the degree program. B.Sc ${department}`,
    doc.internal.pageSize.getWidth() / 2,
    110, { align: 'center', maxWidth: 250 }
  );

  doc.setFontSize(17);
  doc.text(`And has earned a CGPA of ${cgpa.toFixed(2)} (${grade}) in the course`, doc.internal.pageSize.getWidth() / 2, 130, { align: 'center' });

  doc.setFontSize(20);
  doc.text(`B.Sc ${department}`, doc.internal.pageSize.getWidth() / 2, 140, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(`Institution: ${institution}`, doc.internal.pageSize.getWidth() / 2, 160, { align: 'center' });
  doc.text(`Registration Number: ${regNumber}`, doc.internal.pageSize.getWidth() / 2, 170, { align: 'center' });

  doc.setFontSize(14);
  doc.text('This certificate is duly issued on the following day:', doc.internal.pageSize.getWidth() / 2, 180, { align: 'center' });
  const date = new Date().toLocaleDateString();
  doc.text(date, doc.internal.pageSize.getWidth() / 2, 190, { align: 'center' });

  doc.save(`${name}_certificate.pdf`);
}

async function getImageData(imageUrl) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

const sign = document.querySelector('.sign');

sign.addEventListener('click', () => {
  const terms = document.querySelector('marquee');
  terms.style.color = 'red';
  sign.style.color = 'midnightblue';
  
  function changeColor(){
    terms.style.color = 'black';
  }
  
  const interval = setInterval(changeColor, 2000);
});