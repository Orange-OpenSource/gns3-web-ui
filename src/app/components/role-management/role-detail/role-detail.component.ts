/*
* Software Name : GNS3 Web UI
* Version: 3
* SPDX-FileCopyrightText: Copyright (c) 2022 Orange Business Services
* SPDX-License-Identifier: GPL-3.0-or-later
*
* This software is distributed under the GPL-3.0 or any later version,
* the text of which is available at https://www.gnu.org/licenses/gpl-3.0.txt
* or see the "LICENSE" file for more details.
*
* Author: Sylvain MATHIEU, Elise LEBEAU
*/
import {Component, OnInit} from '@angular/core';
import {RoleService} from "@services/role.service";
import {ActivatedRoute} from "@angular/router";
import {Server} from "@models/server";
import {ServerService} from "@services/server.service";
import {Role} from "@models/api/role";
import {FormControl, FormGroup} from "@angular/forms";
import {ToasterService} from "@services/toaster.service";

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent implements OnInit {
  server: Server;
  role: Role;
  editRoleForm: FormGroup;

  constructor(private roleService: RoleService,
              private serverService: ServerService,
              private toastService: ToasterService,
              private route: ActivatedRoute) {

    this.editRoleForm = new FormGroup({
      rolename: new FormControl(),
      description: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe((d: { server: Server; role: Role }) => {
      this.server = d.server;
      this.role = d.role;
    });
  }

  onUpdate() {
    this.roleService.update(this.server, this.role)
      .subscribe(() => {
        this.toastService.success(`role: ${this.role.name} was updated`);
      },
        (error) => {
        this.toastService.error(error);
        });
  }
}
