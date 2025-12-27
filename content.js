async function getConversionRate() {
  const { gbpToIls } = await chrome.storage.sync.get("gbpToIls");
  return gbpToIls || 5.2;
}


async function applyDiscount() {
    const { discount } = await chrome.storage.sync.get("discount");
    if (!discount) return;
  
    const multiplier = (100 - discount) / 100;
    const gbpToIls = await getConversionRate();
    console.log("Applying discount:", discount, "% with rate:", gbpToIls);
  
    // 1. FULL PRICE ITEMS
    const fullPriceEls = document.querySelectorAll(".price_CMH3V:not(.markedDown_vW7nV .price_CMH3V)");
  
    fullPriceEls.forEach(el => {
      if (el.dataset.discountApplied === "true") return;
  
      const text = el.innerText.trim();
      const match = text.match(/£(\d+(\.\d+)?)/);
      if (!match) return;
  
      const price = parseFloat(match[1]);
      const newPriceNum = price * multiplier;
      const newPrice = newPriceNum.toFixed(2);
      const newPriceIls = (newPrice * gbpToIls).toFixed(2);

  
      const span = document.createElement("span");
      span.className = "discounted-price";
      span.style.color = "green";
      span.style.marginLeft = "6px";
      span.style.fontWeight = "bold";
      span.textContent = `£${newPrice} (₪${newPriceIls})`;
  
      el.insertAdjacentElement("afterend", span);
  
      el.dataset.discountApplied = "true";
    });
  
    // 2. ALREADY DISCOUNTED ITEMS
    const saleEls = document.querySelectorAll(".saleAmount_C4AGB");
  
    saleEls.forEach(el => {
      if (el.dataset.discountApplied === "true") return;
  
      const text = el.innerText.trim();
      const match = text.match(/£(\d+(\.\d+)?)/);
      if (!match) return;
  
      const salePrice = parseFloat(match[1]);
      const newPriceNum = salePrice * multiplier;
      const newPrice = newPriceNum.toFixed(2);
      const newPriceIls = (newPriceNum * gbpToIls).toFixed(2);
  
      const span = document.createElement("span");
      span.className = "discounted-price";
      span.style.color = "green";
      span.style.marginLeft = "6px";
      span.style.fontWeight = "bold";
      span.textContent = `£${newPrice} (₪${newPriceIls})`;
  
      el.insertAdjacentElement("afterend", span);
  
      el.dataset.discountApplied = "true";
    });
  
    // 3. PRODUCT DETAIL PAGE PRICE
    const detailPriceEls = document.querySelectorAll('[data-testid="current-price"]');
  
    detailPriceEls.forEach(el => {
      if (el.dataset.discountApplied === "true") return;
  
      const text = el.innerText.trim();
      const match = text.match(/£(\d+(\.\d+)?)/);
      if (!match) return;
  
      const price = parseFloat(match[1]);
      const newPriceNum = price * multiplier;
      const newPrice = newPriceNum.toFixed(2);
      const newPriceIls = (newPriceNum * gbpToIls).toFixed(2);
  
      const span = document.createElement("span");
      span.className = "discounted-price";
      span.style.color = "green";
      span.style.marginLeft = "8px";
      span.style.fontWeight = "bold";
      span.textContent = `£${newPrice} (₪${newPriceIls})`;
  
      el.insertAdjacentElement("afterend", span);
  
      el.dataset.discountApplied = "true";
    });
  }
  
  // Run once
  applyDiscount();
  
  // Re-run whenever ASOS loads new products dynamically
  const observer = new MutationObserver(() => applyDiscount());
  observer.observe(document.body, { childList: true, subtree: true });
  