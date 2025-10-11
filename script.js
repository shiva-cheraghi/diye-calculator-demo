const data = {
  "چشم": {
    "از بین رفتن هر چشم سالم": 50,
    "چشمی که سیاهی آن لکه سفیدی باشد و مانع دیدن باشد": 50,
    "از بین رفتن چشم سالم در صورتی که چشم دیگر نابینا مادرزاد باشد": 100,
    "از بین رفتن چشم نابینا": 16.66
  },
  "ابرو": {
    "از بین رفتن هر ابرو": 25
  },
  "بینی": {
    "قطع یا از بین بردن تمام نرمه بینی": 100,
    "شکستن مطلوب بینی": 10,
    "از بین رفتن هر یک از پره‌های بینی": 33.33,
    "فلج شدن بینی": 66.66,
    "از بین بردن نوک بینی (محل چکیدن خون)": 50,
    "پاره کردن بینی (در صورتی که سبب از بین رفتن بینی یا نوک آن شود)": 33.33
  }
};

const perPercentEl = document.getElementById("perPercentForensic");
const memberEl = document.getElementById("member");
const subMemberEl = document.getElementById("subMember");
const listEl = document.getElementById("membersForensic");
const arshListEl = document.getElementById("arshList");

// تغییر لیست دوم بر اساس عضو انتخاب‌شده
memberEl.addEventListener("change", () => {
  const member = memberEl.value;
  subMemberEl.innerHTML = "<option value=''>انتخاب کنید</option>";
  if (!member || !data[member]) return;
  Object.keys(data[member]).forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.text = sub;
    subMemberEl.appendChild(opt);
  });
});

// افزودن مورد دیه پزشکی قانونی
document.getElementById("add").addEventListener("click", () => {
  const member = memberEl.value;
  const sub = subMemberEl.value;
  const count = parseInt(document.querySelector(".count").value) || 1;
  if (!member || !sub) {
    alert("لطفاً عضو و نوع آسیب را انتخاب کنید");
    return;
  }

  const pct = data[member][sub];
  const row = document.createElement("div");
  row.className = "member-row";
  row.dataset.percent = pct;
  row.dataset.count = count;
  row.innerHTML = `
    <div><strong>${member}</strong> — ${sub}<br>
    تعداد: ${count} — درصد: ${pct}%</div>
    <div><button class="remove">حذف</button></div>
  `;
  row.querySelector(".remove").addEventListener("click", () => row.remove());
  listEl.appendChild(row);
});

// افزودن ارش دستی (با منطق جدید)
document.getElementById("addArsh").addEventListener("click", () => {
  const title = document.getElementById("arshTitle").value.trim();
  const percent = parseFloat(document.getElementById("arshPercent").value) || 0;
  const amount = parseFloat(document.getElementById("arshAmount").value) || 0;

  if (!title) {
    alert("شرح ارش را وارد کنید");
    return;
  }

  const row = document.createElement("div");
  row.className = "member-row";
  row.dataset.percent = percent;
  // اگر درصد وارد شده باشد، مبلغ مستقیم در نظر گرفته نمی‌شود
  row.dataset.amount = percent > 0 ? 0 : amount;

  let infoText = `<strong>ارش:</strong> ${title}<br>`;
  if (percent > 0) {
    infoText += `درصد: ${percent}%`;
  } else if (amount > 0) {
    infoText += `مبلغ مستقیم: ${amount.toLocaleString()} تومان`;
  } else {
    infoText += `<span style="color:red;">هیچ مقداری وارد نشده است</span>`;
  }

  row.innerHTML = `
    <div>${infoText}</div>
    <div><button class="remove">حذف</button></div>
  `;

  row.querySelector(".remove").addEventListener("click", () => row.remove());
  arshListEl.appendChild(row);

  // پاک کردن ورودی‌ها
  document.getElementById("arshTitle").value = "";
  document.getElementById("arshPercent").value = "";
  document.getElementById("arshAmount").value = "";
});

// محاسبه نهایی
document.getElementById("calc").addEventListener("click", () => {
  const per = parseFloat(perPercentEl.value) || 0;
  const forensicRows = Array.from(listEl.children);
  const arshRows = Array.from(arshListEl.children);

  if (!forensicRows.length && !arshRows.length) {
    alert("هیچ موردی اضافه نشده است");
    return;
  }

  let totalPercent = 0;
  let totalArshPercent = 0;
  let totalArshAmount = 0;

  forensicRows.forEach(r => {
    const pct = parseFloat(r.dataset.percent) || 0;
    const count = parseFloat(r.dataset.count) || 1;
    totalPercent += pct * count;
  });

  arshRows.forEach(r => {
    totalArshPercent += parseFloat(r.dataset.percent) || 0;
    totalArshAmount += parseFloat(r.dataset.amount) || 0;
  });

  const finalPercent = totalPercent + totalArshPercent;
  const calcFromPercent = finalPercent * per;
  const totalAmount = calcFromPercent + totalArshAmount;

  document.getElementById("result").innerHTML = `
    <div class="card">
      <div><strong>درصد کل ارش و دیات:</strong> ${finalPercent.toFixed(2)}%</div>
      <hr>
      <div style="font-size:18px; color:#0a58ca;">
        <strong>مبلغ کل نهایی:</strong> ${totalAmount.toLocaleString()} تومان
      </div>
    </div>
  `;
});

// پاک کردن همه موارد
document.getElementById("clear").addEventListener("click", () => {
  listEl.innerHTML = "";
  arshListEl.innerHTML = "";
  document.getElementById("result").innerHTML = "";
});
