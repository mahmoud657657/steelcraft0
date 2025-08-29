
const CART_KEY="store_cart_v2";
export function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[] }catch(e){ return [] }}
export function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)) }
export function updateCartCount(){
  const el=document.querySelector('.cart-count'); if(!el) return;
  el.textContent = loadCart().reduce((a,b)=>a+b.qty,0);
}
export async function fetchProducts(){
  const res = await fetch('./data/products.json'); return res.json();
}
export function addToCart(item){
  const c=loadCart(); const i=c.findIndex(p=>p.id===item.id);
  if(i>=0) c[i].qty+=1; else c.push({...item, qty:1});
  saveCart(c); updateCartCount(); alert("تمت الإضافة للسلة ✅");
}
export function removeFromCart(id){
  const c=loadCart().filter(p=>p.id!==id); saveCart(c); renderCart && renderCart();
}
export function renderCart(){
  const tbody=document.getElementById('cart-body'); const totalEl=document.getElementById('cart-total');
  if(!tbody) return;
  const cart=loadCart();
  tbody.innerHTML = cart.map(p=>`
    <tr><td>${p.name}</td><td>${p.qty}</td><td>${p.price.toFixed(2)} ₪</td>
    <td>${(p.qty*p.price).toFixed(2)} ₪</td>
    <td><button onclick="removeFromCart(${p.id})">حذف</button></td></tr>`).join('');
  const total=cart.reduce((a,b)=>a+b.qty*b.price,0);
  totalEl.textContent = total.toFixed(2)+" ₪";
}
export function whatsappCheckout(){
  const cart=loadCart(); if(!cart.length){ alert("السلة فاضية"); return; }
  const lines = cart.map(p=>`• ${p.name} x${p.qty} = ${(p.qty*p.price).toFixed(2)}₪`);
  const total = cart.reduce((a,b)=>a+b.qty*b.price,0).toFixed(2);
  const msg = encodeURIComponent(`طلب جديد:\n${lines.join('\n')}\nالمجموع: ${total}₪`);
  const phone="972590000000"; // بدّل رقمك
  window.open(`https://wa.me/${phone}?text=${msg}`,"_blank");
}
document.addEventListener('DOMContentLoaded', updateCartCount);
