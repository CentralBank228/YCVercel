const fs = require('fs');
let content = fs.readFileSync('src/components/Cart.tsx', 'utf8');
const lines = content.split('\n');

// index 215 is line 216
const before = lines.slice(0, 215).join('\n');

// index 447 is line 448 
const after = lines.slice(447).join('\n');

const replacement = `            {orderStatus !== 'idle' && (
              <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 text-center">
                {orderStatus === 'loading' ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-stone-100 border-t-[#B49E7C] rounded-full animate-spin" />
                    <p className="text-text-main font-bold tracking-[0.2em] uppercase text-xs">Обработка...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-[#B49E7C]">
                      <CheckCircle2 size={40} />
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl text-text-main mb-3">Ваша заявка принята</h3>
                      <p className="text-sm text-text-muted leading-relaxed max-w-sm">
                        Спасибо! Мы свяжемся с вами в течение 15 минут для подтверждения бронирования.
                      </p>
                    </div>
                    <button 
                      onClick={closeCart}
                      className="bg-text-main text-white py-3 px-8 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#1C2C2B] transition-all rounded-sm mt-4"
                    >
                      Закрыть
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-stone-100 bg-white shrink-0">
              <div className="flex flex-col">
                <h2 className="text-xl font-serif text-text-main mb-1">Бронирование</h2>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#B49E7C] font-bold">Оформление заявки</div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-text-main transition-colors p-2 hover:bg-stone-50 rounded-full">
                <X size={24} />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-[#FCFAF7] custom-scrollbar relative">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }} 
                    transition={{ duration: 0.3 }}
                    className="p-4 space-y-6"
                  >
                     {/* House Selection */}
                     <section className="space-y-4">
                       <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-text-main">1. Выбор банного дома</h3>
                       <div className="grid grid-cols-1 gap-3">
                         {bathHouses.map(house => {
                           const isInCart = items.some(i => i.id === house.id);
                           return (
                             <div key={house.id} className={\`flex items-center gap-3 p-2 border rounded-sm transition-all bg-white cursor-pointer \${isInCart ? 'border-[#B49E7C] shadow-sm bg-stone-50/50' : 'border-stone-100 hover:border-stone-200'}\`} onClick={() => { if (!isInCart) addToCart({ id: house.id, title: house.title, price: house.price, image: house.image, type: 'house' }); }}>
                               <div className="w-16 h-16 shrink-0 bg-stone-100 rounded-sm overflow-hidden">
                                 <img src={house.image} alt={house.title} className="w-full h-full object-cover" />
                               </div>
                               <div className="flex-1 min-w-0">
                                 <h4 className="text-[11px] font-bold text-text-main uppercase mb-1">{house.title}</h4>
                                 <p className="text-[10px] text-text-muted">{house.price} / час</p>
                               </div>
                               <div className="mr-2">
                                 {isInCart ? (
                                   <button onClick={(e) => { e.stopPropagation(); handleRemoveFromCart(house.id); }} className="w-6 h-6 rounded-sm bg-red-50 text-red-500 border border-red-100 flex items-center justify-center hover:bg-red-100 transition-colors">
                                     <X size={12} />
                                   </button>
                                 ) : (
                                   <div className="w-6 h-6 rounded-sm bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400">
                                     <Plus size={12} />
                                   </div>
                                 )}
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     </section>
                     
                     {/* Date and Time Selection */}
                     <section className="space-y-4">
                       <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-text-main">2. Дата и время</h3>
                       <div className="bg-white border text-text-main border-stone-200 rounded-sm overflow-hidden">
                          <button 
                            disabled={!items.some(i => i.type === 'house')}
                            onClick={() => items.some(i => i.type === 'house') && setShowCalendar(true)}
                            className={\`w-full flex items-center justify-between p-4 transition-colors \${!items.some(i => i.type === 'house') ? 'opacity-50 cursor-not-allowed bg-stone-50' : 'hover:bg-stone-50'}\`}
                          >
                            <div className="flex items-center gap-3">
                              <Calendar size={16} className="text-[#B49E7C]" />
                              <div className="flex flex-col items-start px-2">
                                <span className="text-[11px] font-bold uppercase">{bookingDate && bookingTime ? getFormattedDate() : 'Выберите дату и время'}</span>
                                {bookingTime && <span className="text-[10px] text-text-muted mt-1">{getFormattedTime()}</span>}
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-stone-400" />
                          </button>
                       </div>
                     </section>
                     
                     {/* Guests */}
                     <section className="space-y-4">
                       <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-text-main">3. Гости</h3>
                       <div className={\`space-y-3 \${!items.some(i => i.type === 'house') ? 'opacity-50 pointer-events-none' : ''}\`}>
                         <div className="flex items-center justify-between bg-white p-3 border border-stone-200 rounded-sm">
                           <div className="flex flex-col">
                             <span className="text-[11px] font-bold uppercase text-text-main">Взрослые</span>
                           </div>
                           <div className="flex items-center gap-4">
                             <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="w-8 h-8 flex items-center justify-center border border-stone-200 rounded-sm text-text-muted hover:text-text-main bg-stone-50">-</button>
                             <span className="text-[13px] font-mono min-w-[2ch] justify-center flex text-text-main">{guestCount}</span>
                             <button onClick={() => setGuestCount(guestCount + 1)} className="w-8 h-8 flex items-center justify-center border border-stone-200 rounded-sm text-text-muted hover:text-text-main bg-stone-50">+</button>
                           </div>
                         </div>
                         <div className="flex items-center justify-between bg-white p-3 border border-stone-200 rounded-sm">
                           <div className="flex flex-col">
                             <span className="text-[11px] font-bold uppercase text-text-main">Дети</span>
                             <span className="text-[9px] text-text-muted mt-0.5">до 14 лет</span>
                           </div>
                           <div className="flex items-center gap-4">
                             <button onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} className="w-8 h-8 flex items-center justify-center border border-stone-200 rounded-sm text-text-muted hover:text-text-main bg-stone-50">-</button>
                             <span className="text-[13px] font-mono min-w-[2ch] justify-center flex text-text-main">{childrenCount}</span>
                             <button onClick={() => setChildrenCount(childrenCount + 1)} className="w-8 h-8 flex items-center justify-center border border-stone-200 rounded-sm text-text-muted hover:text-text-main bg-stone-50">+</button>
                           </div>
                         </div>
                       </div>
                     </section>
                  </motion.div>
                )}
                
                {currentStep === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    transition={{ duration: 0.3 }}
                    className="p-4 space-y-6"
                  >
                     <div className="flex flex-col gap-2">
                       <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-text-main">Услуги и дополнения</h3>
                     </div>
                     
                     <div className="space-y-3">
                     
                     {/* Section Template */}
                     {[
                       { id: 'rituals', title: '1. Ритуалы парения', items: rituals.filter(r => r.category === "Ритуалы парения").map(r => ({ ...r, type: 'ritual' })) },
                       { id: 'massages', title: '2. Массажи', items: massages.map(r => ({ ...r, price: r.prices && r.prices.length > 0 ? r.prices[0].price : r.price, duration: r.prices && r.prices.length > 0 ? r.prices[0].duration : r.duration, type: 'massage' })) },
                       { id: 'vat', title: '3. Волшебный чан', items: rituals.filter(r => r.category === "Волшебный чан").map(r => ({ ...r, type: 'ritual' })) },
                       { id: 'polog', title: '4. Выбор полога', items: addons.filter(a => a.id.includes('polog') || a.title.toLowerCase().includes('полог')).map(a => ({ ...a, type: 'addon' })) },
                       { id: 'veniki', title: '5. Выбор веников', items: addons.filter(a => a.id.includes('venik')).map(a => ({ ...a, type: 'addon' })) },
                       { id: 'bar', title: '6. Барное меню', items: menuItems.filter(m => m.price).map(a => ({ ...a, type: 'addon' })) }
                     ].map(section => (
                       <section key={section.id} className="bg-white border border-stone-200 rounded-sm overflow-hidden">
                         <button 
                           onClick={() => toggleSection(section.id)}
                           className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-stone-50 transition-colors"
                         >
                           <h4 className="text-[11px] uppercase font-bold text-text-main">{section.title}</h4>
                           <ChevronRight size={14} className={\`text-stone-400 transition-transform duration-300 \${expandedSections[section.id] ? 'rotate-90' : ''}\`} />
                         </button>
                         <AnimatePresence>
                           {expandedSections[section.id] && (
                             <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                               <div className="px-4 pb-4">
                                 {section.items.map(item => {
                                   const cartItemId = item.id;
                                   const cartItem = items.find(i => typeof i.id === 'string' && i.id.startsWith(item.id.toString()));
                                   const isInCart = !!cartItem;
                                   return (
                                     <div key={item.id} className="flex justify-between items-center py-3 border-t border-stone-100 first:border-0">
                                       <div className="flex flex-col flex-1 pr-4">
                                          <span className="text-[10px] font-bold text-text-main uppercase">{item.title}</span>
                                          {item.duration && <span className="text-[9px] text-text-muted mt-0.5">{item.duration} мин</span>}
                                          <span className="text-[10px] text-[#B49E7C] font-medium mt-0.5">{item.price}</span>
                                       </div>
                                       <div>
                                          {isInCart ? (
                                            <div className="flex items-center gap-1">
                                              <div className="flex items-center gap-2 bg-[#FCFAF7] px-1 py-0.5 rounded-sm border border-[#EAE4DC]">
                                                <button onClick={() => updateQuantity(cartItem.id, -1)} className="p-1 text-text-muted hover:text-text-main"><Minus size={10} /></button>
                                                <span className="text-[10px] font-mono min-w-[2ch] text-center text-text-main">{cartItem.quantity || 1}</span>
                                                <button onClick={() => updateQuantity(cartItem.id, 1)} className="p-1 text-text-muted hover:text-text-main"><Plus size={10} /></button>
                                              </div>
                                              <button onClick={() => handleRemoveFromCart(cartItem.id)} className="p-1.5 rounded-sm bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors shrink-0">
                                                <X size={12} />
                                              </button>
                                            </div>
                                          ) : (
                                            <button 
                                              onClick={() => addToCart({ id: cartItemId, title: item.title, price: item.price, image: item.image || '', type: item.type })}
                                              className="w-8 h-8 rounded-sm bg-text-main text-white hover:bg-[#B49E7C] flex items-center justify-center transition-colors shadow-sm"
                                            >
                                              <Plus size={14} />
                                            </button>
                                          )}
                                       </div>
                                     </div>
                                   );
                                 })}
                               </div>
                             </motion.div>
                           )}
                         </AnimatePresence>
                       </section>
                     ))}
                     </div>
                  </motion.div>
                )}`;

const newContent = before + '\n' + replacement + '\n' + after;
fs.writeFileSync('src/components/Cart.tsx', newContent);
console.log('Restored!');
