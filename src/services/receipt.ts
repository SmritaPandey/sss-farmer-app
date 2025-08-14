import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Order, OrderItem } from './orders';

export type ReceiptData = {
  id: string;
  token: string;
  order: Order;
};

function formatOrderText(data: ReceiptData) {
  const lines: string[] = [];
  lines.push('Farmer Service Center Receipt');
  lines.push('--------------------------------');
  lines.push(`Order ID: ${data.id}`);
  lines.push(`Token: ${data.token}`);
  lines.push(`Date: ${data.order.date} ${data.order.hour}`);
  if (data.order.centerName) lines.push(`Center: ${data.order.centerName}`);
  lines.push('');
  lines.push('Items:');
  data.order.items.forEach((it: OrderItem) => {
    lines.push(`- ${it.name} x ${it.quantity} @ ₹${it.price}`);
  });
  lines.push('');
  lines.push(`Total: ₹${data.order.total}`);
  lines.push('Status: Scheduled');
  lines.push('--------------------------------');
  lines.push('Please present this token at the center.');
  return lines.join('\n');
}

export async function saveAndShareReceipt(data: ReceiptData) {
  const content = formatOrderText(data);
  const fileUri = `${FileSystem.cacheDirectory}receipt_${data.token}.txt`;
  await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, { dialogTitle: 'Download Receipt' });
  }
  return fileUri;
}
