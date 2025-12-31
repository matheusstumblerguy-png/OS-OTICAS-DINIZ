document.addEventListener("DOMContentLoaded", () => {
    const btnGerar = document.getElementById("gerarPDF");
    if (btnGerar) {
        btnGerar.addEventListener("click", gerarDocumento);
    }
    // Inicializa os cÃƒÂ¡lculos
    calcularFinanceiro();
});

// --- FUNÃƒâ€¡ÃƒÆ’O DE CÃƒÂLCULO FINANCEIRO ---
function calcularFinanceiro() {
    const pix = parseFloat(document.getElementById('pix').value) || 0;
    const dinheiro = parseFloat(document.getElementById('dinheiro').value) || 0;
    const debito = parseFloat(document.getElementById('debito').value) || 0;
    const credito = parseFloat(document.getElementById('credito').value) || 0;
    const convenio = parseFloat(document.getElementById('convenio').value) || 0;
    const aReceber = parseFloat(document.getElementById('a_receber').value) || 0;
    const desconto = parseFloat(document.getElementById('desconto').value) || 0;

    const subtotal = pix + dinheiro + debito + credito + convenio + aReceber;
    const total = subtotal - desconto;

    document.getElementById('subtotal').value = subtotal.toFixed(2);
    document.getElementById('total').value = total.toFixed(2);
}

// --- FUNÃƒâ€¡ÃƒÆ’O DE BUSCA DE CEP ---
async function buscarCEP() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, ''); 

    if (cep.length !== 8) return;

    try {
        document.getElementById('endereco').value = "...";
        document.getElementById('bairro').value = "...";
        document.getElementById('cidade').value = "...";

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert("CEP nÃƒÂ£o encontrado!");
            limparCamposEndereco();
        } else {
            document.getElementById('endereco').value = data.logradouro;
            document.getElementById('bairro').value = data.bairro;
            document.getElementById('cidade').value = `${data.localidade} - ${data.uf}`;
        }
    } catch (error) {
        alert("Erro ao consultar o CEP.");
        limparCamposEndereco();
    }
}

function limparCamposEndereco() {
    document.getElementById('endereco').value = "";
    document.getElementById('bairro').value = "";
    document.getElementById('cidade').value = "";
}

// --- FUNÃƒâ€¡Ãƒâ€¢ES DE TABELA ---
function adicionarLinha() {
    const tabela = document.getElementById('corpo-tabela-produtos');
    if (tabela.rows.length < 8) {
        const novaLinha = tabela.insertRow();
        novaLinha.innerHTML = `
            <td><input class="p-codigo"></td>
            <td><input class="p-qtd"></td>
            <td><input class="p-nome"></td>
            <td style="text-align: center;">
                <button type="button" onclick="removerLinha(this)" class="btn-remover">Remover</button>
            </td>`;
    } else {
        alert("Limite de 8 produtos atingido!");
    }
}

function removerLinha(botao) {
    const linha = botao.parentNode.parentNode;
    linha.parentNode.removeChild(linha);
}

function formatarDataBR(dataISO) {
    if (!dataISO) return "";
    const partes = dataISO.split("-");
    if (partes.length !== 3) return dataISO;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// --- FUNÃƒâ€¡ÃƒÆ’O PRINCIPAL DO PDF ---
async function gerarDocumento() {
    try {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;

        const url = "modelo_OS.pdf";
        const existingPdfBytes = await fetch(url).then(res => {
            if (!res.ok) throw new Error("Arquivo modelo_OS.pdf nÃƒÂ£o encontrado!");
            return res.arrayBuffer();
        });

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const fonteNegrito = await pdfDoc.embedStandardFont(StandardFonts.HelveticaBold);
        const pages = pdfDoc.getPages();
        const primeiraPagina = pages[0];

        const corTexto = rgb(0.8, 0, 0); 
        const tamFonteNormal = 9;
        const tamFonteOS = 23;

        // --- COORDENADAS FIXAS (VIA LOJA) ---
        const coordenadas = {
            cliente: { x: 70.8, y: 771.1 },
            endereco: { x: 84.0, y: 756.5 },
            bairro: { x: 334.0, y: 773.0 },
            cidade: { x: 340.0, y: 757.0 },
            cep: { x: 322.0, y: 740.5 },
            cpf: { x: 50.0, y: 740.0 },
            fone: { x: 56.0, y: 723.0 },
            nascimento: { x: 183.0, y: 741.0 },
            compra: { x: 197.0, y: 724.0 },
            entrega: { x: 343.0, y: 724.0 },
            lentes: { x: 67.0, y: 694.0 },
            armacao: { x: 80.0, y: 678.0 },
            material: { x: 275.3, y: 680.0 },
            usuario: { x: 72.0, y: 662.0 },
            os: { x: 490.1, y: 750.2 },
            anexo: { x: 496.1, y: 728.6 },
            ponte: { x: 531.0, y: 633.0 },
            aro: { x: 521.0, y: 616.0 },
            vertical: { x: 542.0, y: 599.5 },
            diagonal: { x: 549.0, y: 581.0 },
            base: { x: 527.0, y: 564.0 },
            od_longe_esferico: { x: 114, y: 615 }, od_longe_cilindrico: { x: 171, y: 615 },
            od_longe_eixo: { x: 227, y: 615 }, od_longe_dnp: { x: 281, y: 615 },
            od_longe_altura: { x: 340, y: 615 }, od_longe_adicao: { x: 392, y: 615 },
            od_longe_prisma: { x: 451, y: 615 },
            
            pix: { x: 46, y: 437 },
            dinheiro: { x: 76, y: 422 },
            debito: { x: 67, y: 406 },
            credito: { x: 247, y: 438 },
            convenio: { x: 255, y: 422 },
            a_receber: { x: 261, y: 406 },
            subtotal: { x: 485, y: 439 },
            desconto: { x: 489, y: 422 },
            total: { x: 488, y: 407 }
        };

        const camposData = ["nascimento", "compra", "entrega"];

        for (const id in coordenadas) {
            const campo = document.getElementById(id);
            if (campo && campo.value.trim() !== "") {
                let valor = campo.value;
                if (camposData.includes(id)) valor = formatarDataBR(valor);
                const tamanho = (id === "os") ? tamFonteOS : tamFonteNormal;
                primeiraPagina.drawText(valor, {
                    x: coordenadas[id].x, y: coordenadas[id].y,
                    size: tamanho, font: fonteNegrito, color: corTexto
                });
            }
        }

        // --- LÃƒâ€œGICA DOS PRODUTOS ---
        const gridProdutos = [
            { cod: { x: 32, y: 518 }, qtd: { x: 105, y: 518 }, nome: { x: 296, y: 518 } },
            { cod: { x: 32, y: 503 }, qtd: { x: 105, y: 503 }, nome: { x: 296, y: 503 } },
            { cod: { x: 32, y: 488 }, qtd: { x: 105, y: 488 }, nome: { x: 296, y: 488 } },
            { cod: { x: 32, y: 473 }, qtd: { x: 105, y: 473 }, nome: { x: 296, y: 473 } },
            { cod: { x: 32, y: 458 }, qtd: { x: 105, y: 458 }, nome: { x: 296, y: 458 } },
            { cod: { x: 32, y: 443 }, qtd: { x: 105, y: 443 }, nome: { x: 296, y: 443 } },
            { cod: { x: 32, y: 428 }, qtd: { x: 105, y: 428 }, nome: { x: 296, y: 428 } },
            { cod: { x: 32, y: 413 }, qtd: { x: 105, y: 413 }, nome: { x: 296, y: 413 } }
        ];

        const linhasProdutos = document.querySelectorAll('#corpo-tabela-produtos tr');
        linhasProdutos.forEach((linha, index) => {
            if (index < gridProdutos.length) {
                const cod = linha.querySelector('.p-codigo')?.value || "";
                const qtd = linha.querySelector('.p-qtd')?.value || "";
                const nome = linha.querySelector('.p-nome')?.value || "";
                const coord = gridProdutos[index];
                if (cod.trim()) primeiraPagina.drawText(cod, { x: coord.cod.x, y: coord.cod.y, size: tamFonteNormal, font: fonteNegrito, color: corTexto });
                if (qtd.trim()) primeiraPagina.drawText(qtd, { x: coord.qtd.x, y: coord.qtd.y, size: tamFonteNormal, font: fonteNegrito, color: corTexto });
                if (nome.trim()) primeiraPagina.drawText(nome, { x: coord.nome.x, y: coord.nome.y, size: tamFonteNormal, font: fonteNegrito, color: corTexto });
            }
        });

        // --- VIA DO CLIENTE (DUPLICAÃ‡ÃƒO) ---
        const vPix = parseFloat(document.getElementById('pix').value) || 0;
        const vDin = parseFloat(document.getElementById('dinheiro').value) || 0;
        const vDeb = parseFloat(document.getElementById('debito').value) || 0;
        const vCre = parseFloat(document.getElementById('credito').value) || 0;
        const vCon = parseFloat(document.getElementById('convenio').value) || 0;
        const entradaCalculada = (vPix + vDin + vDeb + vCre + vCon).toFixed(2);

        const camposDuplicar = {
            os:         { id: "os", x: 492, y: 143, size: 23 }, 
            anexo:      { id: "anexo", x: 504.0, y: 124, size: tamFonteNormal },
            cliente:    { id: "cliente", x: 68.0, y: 163, size: tamFonteNormal },
            lentes:     { id: "lentes", x: 66.0, y: 147, size: tamFonteNormal },
            armacao:    { id: "armacao", x: 80.0, y: 132, size: tamFonteNormal },
            compra:     { id: "compra", x: 347.0, y: 160, size: tamFonteNormal },
            entrega:    { id: "entrega", x: 347.0, y: 135, size: tamFonteNormal },
            // Removi a duplicidade do total aqui se ele estava saindo no lugar errado
            total_cliente: { id: "total", x: 96.0, y: 117, size: tamFonteNormal }, 
            entrada:    { valor: entradaCalculada, x: 347.0, y: 105, size: tamFonteNormal },
            a_receber_cliente: { id: "a_receber", x: 367.0, y: 117, size: tamFonteNormal }
        };

        for (const chave in camposDuplicar) {
            const config = camposDuplicar[chave];
            let valorFinal = "";

            if (config.id) {
                const el = document.getElementById(config.id);
                if (el && el.value.trim() !== "") {
                    valorFinal = el.value;
                    if (camposData.includes(config.id)) valorFinal = formatarDataBR(valorFinal);
                }
            } else if (config.valor) {
                valorFinal = config.valor;
            }

            if (valorFinal !== "" && valorFinal !== "0.00") {
                primeiraPagina.drawText(valorFinal, {
                    x: config.x,
                    y: config.y,
                    size: config.size,
                    font: fonteNegrito,
                    color: corTexto
                });
            }
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `OS_Diniz_${document.getElementById("os")?.value || 'Gerada'}.pdf`;
        link.click();

    } catch (erro) {
        alert("Erro ao gerar PDF: " + erro.message);
    }
}