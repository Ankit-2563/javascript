/* 
  --------------------
  Concept: Break big tasks into chunks so the event loop can breathe.

  Using setTimeout(0) allows other operations to run in between chunks.
*/

const items = Array.from({ length: 200000 }, (_, i) => i);

function processChunk(startIndex, chunkSize) {
  const endIndex = Math.min(startIndex + chunkSize, items.length);

  for (let i = startIndex; i < endIndex; i++) {
    Math.sqrt(i); // simulate heavy work
  }

  console.log(`Processed ${startIndex} to ${endIndex - 1}`);

  if (endIndex < items.length) {
    setTimeout(() => processChunk(endIndex, chunkSize), 0);
  } else {
    console.log("Done!");
  }
}

console.log("Starting...");
processChunk(0, 40000);
console.log("Still responsive while chunks run!");
