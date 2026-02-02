import axios from "axios";
import { TFastOrder, TOrderRequest } from "./order";

export const send = async (data: TOrderRequest) => {
  try {
    const fullName = `${data.surname ?? ''} ${data.name ?? ''} ${data.middle_name ?? ''}`.trim();
    const address = data.postomat
      ? `Поштомат: ${data.postomat}`
      : `Відділення: ${data.branch}`;
    const location = `${data.area} обл, ${data.city}`;
    const comment = data.comment ? `Коментар: ${data.comment}` : '';
    const phone = data.phone ?? '';

    const productsText = data.products.map((item, idx) => 
      `#${idx + 1}: Товар: ${item.name}, Розмір: ${item.size_eu}${item.size_cm ? `/${item.size_cm}` : ''}, К-сть: ${item.quantity}, ${item.disconted_price 
        ? `Ціна: ${item.disconted_price} (${item.price}) грн` 
        : `Ціна: ${item.price} грн`}`
    ).join('\n');     

    const message = `
🛒 *Нове замовлення!*

👤 *Клієнт:* ${fullName}
📞 *Телефон:* ${phone}
📍 *Місцезнаходження:* ${location}
🏤 *Доставка:* ${address}
📝 ${comment}

📦 *Товари:*
${productsText}
    `;

    await axios.post(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.NEXT_PUBLIC_TELEGRAM_CHANEL_TOKEN,
      text: message,
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("❌ Помилка при відправці повідомлення в Telegram:", error);
  }
};


export const fastSend = async (data: TFastOrder) => {
  try {
    const fullName = `${data.surname ?? ''} ${data.name ?? ''}`.trim();
    const phone = data.phone ?? ''; 
    const productsText = data.products.map((item, idx) => 
      `#${idx + 1}: Товар: ${item.name}, Розмір: ${item.size_eu}${item.size_cm ? `/${item.size_cm}` : ''}, К-сть: ${item.quantity}, ${item.disconted_price 
        ? `Ціна: ${item.disconted_price} (${item.price}) грн` 
        : `Ціна: ${item.price} грн`}`
    ).join('\n');    

    const message = `
🛒 *Замовлення в один клік!*

👤 *Клієнт:* ${fullName}
📞 *Телефон:* ${phone}
📦 *Товари:*
${productsText}
    `;
    await axios.post(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.NEXT_PUBLIC_TELEGRAM_CHANEL_TOKEN,
      text: message,
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("❌ Помилка при відправці повідомлення в Telegram:", error);
  }
};
