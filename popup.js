// Save discount and apply to current tab
document.getElementById("saveBtn").addEventListener("click", () => {
  const discount = parseFloat(document.getElementById("discountInput").value);
  
  if (isNaN(discount) || discount < 0 || discount > 90) {
    alert("Please enter a valid discount between 0 and 90");
    return;
  }

  chrome.storage.sync.set({ discount }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          // Clear existing discounts first
          document.querySelectorAll(".discounted-price").forEach(el => el.remove());
          document.querySelectorAll("[data-discount-applied]").forEach(el => {
            delete el.dataset.discountApplied;
          });
          // Trigger a re-run of applyDiscount
          window.location.reload();
        }
      });
    });
  });
});

// Allow pressing Enter to apply discount
document.getElementById("discountInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("saveBtn").click();
  }
});

// Clear discount and reset prices
document.getElementById("clearBtn").addEventListener("click", () => {
  chrome.storage.sync.remove("discount", () => {
    document.getElementById("discountInput").value = "";
    
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          document.querySelectorAll(".discounted-price").forEach(el => el.remove());
          document.querySelectorAll("[data-discount-applied]").forEach(el => {
            delete el.dataset.discountApplied;
          });
        }
      });
    });
  });
});

// Load saved discount on popup open
chrome.storage.sync.get("discount", ({ discount }) => {
  if (discount) {
    document.getElementById("discountInput").value = discount;
  }
});
  