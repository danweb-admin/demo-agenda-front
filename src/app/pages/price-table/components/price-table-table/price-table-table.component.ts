import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipamentsService } from 'src/app/shared/services/equipaments.service';
import { PriceTableService } from 'src/app/shared/services/price-table.service';

@Component({
  selector: 'app-price-table-table',
  templateUrl: './price-table-table.component.html',
  styleUrls: ['./price-table-table.component.scss']
})
export class PriceTableTableComponent implements OnInit {

  form!: FormGroup;
  equipamentos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private equipamentoService: EquipamentsService,
    private priceTableService: PriceTableService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      equipamentos: this.fb.array([]),
    });

    // 1️⃣ Buscar todos os equipamentos
    this.equipamentoService.loadEquipaments(true).subscribe((equipamentos) => {
      this.equipamentos = equipamentos;

      const formArray = this.form.get('equipamentos') as FormArray;

      equipamentos.forEach((eq) => {
        const grupo = this.fb.group({
          id: [eq.id],
          nome: [eq.name],
          valores: this.fb.array([]),
        });

        formArray.push(grupo);

        // 2️⃣ Buscar os preços de cada equipamento
        this.priceTableService.loadPriceTable(eq.id).subscribe((precos) => {
          const valoresArray = grupo.get('valores') as FormArray;

          precos.forEach((p: any) => {
            valoresArray.push(
              this.fb.group({
                id: [p.id],
                equipmentId: [p.equipmentId],
                minutes: [this.converterMinutosParaHoraString(p.minutes)],
                value: [this.converterNumeroParaMoeda(p.value)],
              })
            );
          });
        });
      });
    });
  }

  // 🔹 Getters de conveniência
  get equipamentosFormArray(): FormArray {
    return this.form.get('equipamentos') as FormArray;
  }

  getValores(equipamentoIndex: number): FormArray {
    return this.equipamentosFormArray.at(equipamentoIndex).get('valores') as FormArray;
  }

  // 🔹 Adicionar novo preço manualmente
  adicionarPreco(equipamentoIndex: number) {
    const valoresArray = this.getValores(equipamentoIndex);
    let equipamento = this.equipamentos[equipamentoIndex];
    
    valoresArray.push(
      this.fb.group({
        id: [null],
        equipmentId: [equipamento.id],
        minutes: [''],
        value: ['R$ 0,00'],
      })
    );
  }

  // 🔹 Salvar tudo (faz as conversões HH:mm → minutos e R$ → número)
  salvar() {
    const formValue = this.form.value;

    const payload = formValue.equipamentos.map((eq: any) => ({
      id: eq.id,
      valores: eq.valores.map((v: any) => ({
        id: v.id,
        equipmentId: v.equipmentId,
        minutes: this.converterHoraStringParaMinutos(v.minutes),
        value: this.converterMoedaParaNumero(v.value),
      })),
    }));

    console.log('Payload para backend:', payload);

    // Envie para o backend:
    this.priceTableService.save(payload).subscribe(() => {
      alert('Preços salvos com sucesso!');
    });
  }

  // 🕒 Conversões de tempo
  private converterMinutosParaHoraString(minutos: number): string {
    if (minutos == null) return '';
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private converterHoraStringParaMinutos(horaStr: string): number {
    
    if (!horaStr) return 0;
    let formatado = horaStr.substring(0, 2) + ":" + horaStr.substring(2);
    const [h, m] = formatado.split(':').map(Number);
    return (h * 60) + (m || 0);
  }

  // 💰 Conversões de valor
  private converterNumeroParaMoeda(valor: number): string {
    
    if (valor == null) return 'R$ 0,00';

    return Number(valor).toFixed(2).toString().replace('.',',');
  }

  private converterMoedaParaNumero(valor: string): number {
    
    if (!valor) return 0;
    return Number(
      valor
        .toString()
        .replace('R$', '')
        .replace(',', '.')
        .trim()
    );
  }
}
