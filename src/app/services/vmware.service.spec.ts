import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';
import{ Controller } from '../models/controller';
import { VmwareTemplate } from '../models/templates/vmware-template';
import { AppTestingModule } from '../testing/app-testing/app-testing.module';
import { HttpController } from './http-controller.service';
import { getTestController } from './testing';
import { VmwareService } from './vmware.service';

describe('VmwareService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let httpController: HttpController;
  let controller:Controller ;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppTestingModule],
      providers: [HttpController, VmwareService],
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    httpController = TestBed.get(HttpController);
    controller = getTestController();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([VmwareService], (service: VmwareService) => {
    expect(service).toBeTruthy();
  }));

  it('should update vmware template', inject([VmwareService], (service: VmwareService) => {
    const template: VmwareTemplate = {
      adapter_type: 'e1000',
      adapters: 1,
      builtin: false,
      category: 'guest',
      compute_id: 'local',
      console_auto_start: false,
      console_type: 'none',
      custom_adapters: [],
      default_name_format: '{name}-{0}',
      first_port_name: '',
      headless: false,
      linked_clone: false,
      name: '',
      on_close: 'power-off',
      port_name_format: 'Ethernet{0}',
      port_segment_size: 0,
      symbol: ':/symbols/vmware_guest.svg',
      template_id: '1',
      template_type: 'vmware',
      usage: '',
      use_any_adapter: false,
      vmx_path: '',
    };

    service.saveTemplate(controller, template).subscribe();

    const req = httpTestingController.expectOne(`http://127.0.0.1:3080/${environment.current_version}/templates/1`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(template);
  }));

  it('should add vmware template', inject([VmwareService], (service: VmwareService) => {
    const template: VmwareTemplate = {
      adapter_type: 'e1000',
      adapters: 1,
      builtin: false,
      category: 'guest',
      compute_id: 'local',
      console_auto_start: false,
      console_type: 'none',
      custom_adapters: [],
      default_name_format: '{name}-{0}',
      first_port_name: '',
      headless: false,
      linked_clone: false,
      name: '',
      on_close: 'power-off',
      port_name_format: 'Ethernet{0}',
      port_segment_size: 0,
      symbol: ':/symbols/vmware_guest.svg',
      template_id: '1',
      template_type: 'vmware',
      usage: '',
      use_any_adapter: false,
      vmx_path: '',
    };

    service.addTemplate(controller, template).subscribe();

    const req = httpTestingController.expectOne(`http://127.0.0.1:3080/${environment.current_version}/templates`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(template);
  }));

  it('should get available virtual machines', inject([VmwareService], (service: VmwareService) => {
    service.getVirtualMachines(controller).subscribe();

    const req = httpTestingController.expectOne(`http://127.0.0.1:3080/${environment.current_version}/computes/${environment.compute_id}/vmware/vms`);
    expect(req.request.method).toEqual('GET');
  }));
});
