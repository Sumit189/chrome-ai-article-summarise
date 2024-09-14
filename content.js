// content.js

async function summarizeAndRewriteArticle(tone) {
    let articleText = document.body.innerText;
    chrome.runtime.sendMessage({ type: "SHOW_LOADER", loaderName: "summary-block-loader" });
    chrome.runtime.sendMessage({ type: "SHOW_LOADER", loaderName: "rewrite-block-loader" });
    
    let { summaryErr, summarizedText } = await callSummarizationAPI(articleText);
    if (summaryErr) {
        chrome.runtime.sendMessage({ type: "DISPLAY_SUMMARY", data: summaryErr });
        return;
    }
    chrome.runtime.sendMessage({ type: "DISPLAY_SUMMARY", data: summarizedText });

    let { reWriteErr, rewrittenText } = await callRewriterAPI(summarizedText, tone);
    if (reWriteErr) {
        chrome.runtime.sendMessage({ type: "DISPLAY_REWRITTEN", data: reWriteErr });
        return;
    }
    chrome.runtime.sendMessage({ type: "DISPLAY_REWRITTEN", data: rewrittenText });
}

async function callSummarizationAPI(text) {
    const canSummarize = await ai?.summarizer?.capabilities();
    let summarizer;
    if (canSummarize && canSummarize.available !== 'no') {
        if (canSummarize.available === 'readily') {
            summarizer = await ai.summarizer.create();
            const result = await summarizer.summarize(text);
            return { summarizedText: result };
        } else {
            // The summarizer can be used after the model download.
            summarizer = await ai.summarizer.create();
            summarizer.addEventListener('downloadprogress', (e) => {
                console.log(e.loaded, e.total);
            });
            await summarizer.ready;
        }
    } else {
        return { summaryErr: "Summarize API not available" };
    }
}

async function callRewriterAPI(text, tone) {
    const canRewrite = await ai?.rewriter
    if (canRewrite) {
        const rewriter = await ai.rewriter.create();
        const result = await rewriter.rewrite(text, { context: `Write the given summarize in this tone: ${tone}` });
        return { rewrittenText: result };
    } else {
        return { reWriteErr: "Rewriter API not available" };
    }
}
