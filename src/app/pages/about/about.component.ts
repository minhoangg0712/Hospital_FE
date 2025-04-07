import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  coreValues = [
    { title: 'Thượng Tôn Pháp Luật', content: 'Mọi hoạt động đều tuân thủ quy định pháp luật.' },
    { title: 'Uy Tín', content: 'Lấy uy tín làm gốc rễ cho mọi hoạt động của bệnh viện.' },
    { title: 'Hợp Tác', content: 'Sẵn sàng hợp tác với đối tác để tối ưu dịch vụ.' },
    { title: 'Cải Tiến', content: 'Liên tục cải tiến để nâng cao chất lượng dịch vụ.' }
  ];
}
