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
import { Injectable } from '@angular/core';
import {HttpController} from "./http-controller.service";
import {Controller} from "../models/controller";
import {Group} from "../models/groups/group";
import {Role} from "../models/api/role";
import {Permission} from "@models/api/permission";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpController: HttpController) { }

  get(controller: Controller) {
    return this.httpController.get<Role[]>(controller, '/roles');
  }

  delete(controller: Controller, role_id: string) {
    return this.httpController.delete(controller, `/roles/${role_id}`);
  }

  create(controller: Controller, newRole: { name: string; description: string }) {
    return this.httpController.post(controller, `/roles`, newRole);
  }

  getById(controller: Controller, roleId: string) {
    return this.httpController.get<Role>(controller, `/roles/${roleId}`);
  }

  update(controller: Controller, role: Role) {
    return this.httpController.put(controller, `/roles/${role.role_id}`, {name: role.name, description: role.description});
  }

  addPermission(controller: Controller, role: Role, permission: Permission) {
    return this.httpController.put(controller, `/roles/${role.role_id}/permissions/${permission.permission_id}`, {});

  }

  removePermission(controller: Controller, role: Role, permission: Permission) {
    return this.httpController.delete(controller, `/roles/${role.role_id}/permissions/${permission.permission_id}`);
  }
}