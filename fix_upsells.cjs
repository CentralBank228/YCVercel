const fs = require('fs');

let content = fs.readFileSync('src/components/Cart.tsx', 'utf-8');

content = content.replace(/\$\{isInCart \? 'grayscale opacity-30 scale-105' : 'grayscale-\[0\\\.5\] hover:grayscale-0'\}/g, 'transition-transform duration-700 hover:scale-105');

const blockRegex = /<button[\s\S]*?onClick=\{\([^)]*\)\s*=>\s*\{[\s\S]*?addToCart\(\{.*?: ([a-zA-Z0-9_]+)\.title[\s\S]*?\}\)[\s\S]*?\}\}[\s\S]*?className=\{`w-5 h-5[\s\S]*?`\}[\s\S]*?>[\s\S]*?<\/button>/g;

content = content.replace(blockRegex, (match, itemVarName) => {
  let cartIdLogic = `const cartItemId = items.find(i => i.id === ${itemVarName}.id || (typeof i.id === 'string' && i.id.startsWith(\`\$\{${itemVarName}.id}-\`)))?.id || ${itemVarName}.id;`;
  
  if (!match.includes('startsWith') && !match.includes('.split')) {
    cartIdLogic = `const cartItemId = ${itemVarName}.id;`;
  }

  let addToCartCall = match.match(/addToCart\(\{[\s\S]*?\}\)/)[0];

  return `
                                        {isInCart ? (
                                          <div className="flex items-center gap-1">
                                            <div className="flex items-center gap-2 bg-stone-50 px-1 py-0.5 rounded-sm border border-stone-200">
                                              <button onClick={() => updateQuantity(items.find(i => i.id === ${itemVarName}.id || (typeof i.id === 'string' && i.id.startsWith(\`\$\{${itemVarName}.id}-\`)))?.id || ${itemVarName}.id, -1)} className="p-0.5 text-text-muted hover:text-text-main"><Minus size={8} /></button>
                                              <span className="text-[9px] font-mono min-w-[1ch] text-center">{items.find(i => i.id === ${itemVarName}.id || (typeof i.id === 'string' && i.id.startsWith(\`\$\{${itemVarName}.id}-\`)))?.quantity || 1}</span>
                                              <button onClick={() => updateQuantity(items.find(i => i.id === ${itemVarName}.id || (typeof i.id === 'string' && i.id.startsWith(\`\$\{${itemVarName}.id}-\`)))?.id || ${itemVarName}.id, 1)} className="p-0.5 text-text-muted hover:text-text-main"><Plus size={8} /></button>
                                            </div>
                                            <button onClick={() => handleRemoveFromCart(items.find(i => i.id === ${itemVarName}.id || (typeof i.id === 'string' && i.id.startsWith(\`\$\{${itemVarName}.id}-\`)))?.id || ${itemVarName}.id)} className="w-[22px] h-[22px] rounded-sm bg-red-50 text-red-500 border border-red-100 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0">
                                              <X size={10} />
                                            </button>
                                          </div>
                                        ) : (
                                          <button 
                                            onClick={() => {
                                              ${addToCartCall}
                                            }}
                                            className="w-5 h-5 rounded-sm flex items-center justify-center transition-all bg-text-main text-white hover:bg-[#B49E7C]"
                                          >
                                            <Plus size={10} />
                                          </button>
                                        )}`;
});

fs.writeFileSync('src/components/Cart.tsx', content);
