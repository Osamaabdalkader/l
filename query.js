document.addEventListener("DOMContentLoaded", function() {
  const submitButton = document.getElementById('submit');
  const toggleButton = document.getElementById('toggleButton');
  const serviceCodeInput = document.getElementById('normalizedservicecode');
  const patientIdInput = document.getElementById('patientid');
  const resultsDiv = document.getElementById('resultsDiv');
  const alertError = document.getElementById('alerterror');
  const alertError2 = document.getElementById('alerterror2');

  async function handleInquiry() {
    const serviceCode = serviceCodeInput.value.trim();
    const patientId = patientIdInput.value.trim();

    if (serviceCode && patientId) {
      try {
        const userId = localStorage.getItem('userId');
        const snapshot = await db.ref(`sickLeaves/${userId}`)
          .orderByChild('serviceCode')
          .equalTo(serviceCode)
          .once('value');

        let found = false;
        
        if (snapshot.exists()) {
          snapshot.forEach(child => {
            const record = child.val();
            if (record.patientId === patientId) {
              found = true;
              // تعبئة البيانات
              document.getElementById('patientname').textContent = record.patientName;
              document.getElementById('sickleavedate').textContent = record.sickLeaveDate;
              document.getElementById('from1').textContent = record.fromDate;
              document.getElementById('to1').textContent = record.toDate;
              document.getElementById('duration').textContent = record.duration + ' يوم';
              document.getElementById('doctorname').textContent = record.doctorName;
              document.getElementById('jobtitle').textContent = record.jobTitle;

              resultsDiv.style.display = 'flex';
              alertError.style.display = 'none';
              alertError2.style.display = 'none';
              submitButton.style.display = 'none';
              toggleButton.style.display = 'block';
            }
          });
        }

        if (!found) {
          alertError2.style.display = 'block';
          resultsDiv.style.display = 'none';
          alertError.style.display = 'none';
          submitButton.style.display = 'block';
          toggleButton.style.display = 'none';
        }
      } catch (error) {
        alertError2.textContent = "حدث خطأ في الاتصال بقاعدة البيانات";
        alertError2.style.display = 'block';
        resultsDiv.style.display = 'none';
      }
    } else {
      alertError.style.display = 'block';
      alertError2.style.display = 'none';
      resultsDiv.style.display = 'none';
    }
  }

  // الأحداث
  submitButton.addEventListener('click', handleInquiry);
  toggleButton.addEventListener('click', () => {
    serviceCodeInput.value = '';
    patientIdInput.value = '';
    resultsDiv.style.display = 'none';
    alertError.style.display = 'none';
    alertError2.style.display = 'none';
    submitButton.style.display = 'block';
    toggleButton.style.display = 'none';
  });

  // البحث عند الضغط على Enter
  patientIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleInquiry();
  });
});
