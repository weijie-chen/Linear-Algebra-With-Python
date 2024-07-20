import matplotlib.pyplot as plt
import numpy as np
import numpy
def linearCombo(a, b, c):
    '''This function is for visualizing linear combination of standard basis in 3D.
    Function syntax: linearCombo(a, b, c), where a, b, c are the scalar multiplier, 
    also the elements of the vector.
    '''
    fig = plt.figure(figsize = (10,10))
    ax = fig.add_subplot(projection='3d')

    ######################## Standard basis and Scalar Multiplid Vectors#########################
    vec = np.array([[[0, 0, 0, 1, 0, 0]], # e1
                    [[0, 0, 0, 0, 1, 0]], # e2
                    [[0, 0, 0, 0, 0, 1]], # e3
                    [[0, 0, 0, a, 0, 0]], # a* e1
                    [[0, 0, 0, 0, b, 0]], # b* e2
                    [[0, 0, 0, 0, 0, c]], # c* e3
                    [[0, 0, 0, a, b, c]]]) # ae1 + be2 + ce3
    colors = ['b','b','b','r','r','r','g']
    for i in range(vec.shape[0]): 
        X, Y, Z, U, V, W = zip(*vec[i,:,:])
        ax.quiver(X, Y, Z, U, V, W, length=1, normalize=False, 
                  color = colors[i] ,arrow_length_ratio = .08, pivot = 'tail',
                  linestyles = 'solid',linewidths = 3, alpha =.6)
    
    #################################Plot Rectangle Boxes##############################
    dlines = np.array([[[a, 0, 0],[a, b, 0]],
                      [[0, b, 0],[a, b, 0]],
                      [[0, 0, c],[a, b, c]],
                      [[0, 0, c],[a, 0, c]],
                      [[a, 0, c],[a, b, c]],
                      [[0, 0, c],[0, b, c]],
                      [[0, b, c],[a, b, c]],
                      [[a, 0, 0],[a, 0, c]],
                      [[0, b, 0],[0, b, c]],
                      [[a, b, 0],[a, b, c]]])
    colors = ['k','k','g','k','k','k','k','k','k']
    for i in range(dlines.shape[0]):
        ax.plot(dlines[i,:,0], dlines[i,:,1], dlines[i,:,2], lw =3, ls = '--', color = 'black', alpha=0.5)
    
    #################################Annotation########################################
    ax.text(x = a, y = b, z = c, s= ' $(%0.d, %0.d, %.0d)$'% (a, b, c), size = 18)
    ax.text(x = a, y = 0, z = 0, s= ' $%0.d e_1 = (%0.d, 0, 0)$'% (a, a), size = 15)
    ax.text(x = 0, y = b, z = 0, s= ' $%0.d e_2 = (0, %0.d, 0)$'% (b, b), size = 15)
    ax.text(x = 0, y = 0, z = c, s= ' $%0.d e_3 = (0, 0, %0.d)$' %(c, c), size = 15)
    
    #################################Axis Setting######################################
    ax.grid()
    ax.set_xlim([0, a+1])
    ax.set_ylim([0, b+1])
    ax.set_zlim([0, c+1])
    
    ax.set_xlabel('x-axis', size = 18)
    ax.set_ylabel('y-axis', size = 18)
    ax.set_zlabel('z-axis', size = 18)
    
    ax.set_title('Vector $(%0.d, %0.d, %.0d)$ Visualization' %(a, b, c), size = 20)
    
    ax.view_init(elev=20., azim=15)

if __name__ == '__main__':
    a = 7
    b = 4
    c = 9
    linearCombo(a, b, c)
    
def linearComboNonStd(a, b, c, vec1, vec2, vec3):
    '''This function is for visualizing linear combination of non-standard basis in 3D.
    Function syntax: linearCombo(a, b, c, vec1, vec2, vec3), where a, b, c are the scalar multiplier, 
    ve1, vec2 and vec3 are the basis.
    '''
    fig = plt.figure(figsize = (10,10))
    ax = fig.add_subplot(projection='3d')
    ########################Plot basis##############################
    vec1 = np.array([[0, 0, 0, vec1[0], vec1[1], vec1[2]]])
    X, Y, Z, U, V, W = zip(*vec1)
    ax.quiver(X, Y, Z, U, V, W, length=1, normalize=False, color = 'blue',arrow_length_ratio = .08, pivot = 'tail',
          linestyles = 'solid',linewidths = 3)
    
    vec2 = np.array([[0, 0, 0, vec2[0], vec2[1], vec2[2]]])
    X, Y, Z, U, V, W = zip(*vec2)
    ax.quiver(X, Y, Z, U, V, W, length=1, normalize=False, color = 'blue',arrow_length_ratio = .08, pivot = 'tail',
          linestyles = 'solid',linewidths = 3)
    
    vec3 = np.array([[0, 0, 0, vec3[0], vec3[1], vec3[2]]])
    X, Y, Z, U, V, W = zip(*vec3)
    ax.quiver(X, Y, Z, U, V, W, length=1, normalize=False, color = 'blue',arrow_length_ratio = .08, pivot = 'tail',
          linestyles = 'solid',linewidths = 3)
    
    ###########################Plot Scalar Muliplied Vectors####################
    avec1 = a * vec1 
    X, Y, Z, U, V, W = zip(*avec1)
    ax.quiver(X, Y, Z, U, V, W, length=1, normalize=False, color = 'red', alpha = .6,arrow_length_ratio = a/100, pivot = 'tail',
          linestyles = 'solid',linewidths = 3)
    
    bvec2 = b * vec2
    X, Y, Z, U, V, W = zip(*bvec2)
    ax.quiver(X, Y, Z, U, V, W, length=1, normalize=False, color = 'red', alpha = .6,arrow_length_ratio = b/100, pivot = 'tail',
          linestyles = 'solid',linewidths = 3)
    
    cvec3 = c * vec3
    X, Y, Z, U, V, W = zip(*cvec3)
    ax.quiver(X, Y, Z, U, V, W, length=1, normalize=False, color = 'red', alpha = .6,arrow_length_ratio = c/100, pivot = 'tail',
          linestyles = 'solid',linewidths = 3)
    
    combo = avec1 + bvec2 + cvec3
    X, Y, Z, U, V, W = zip(*combo)
    ax.quiver(X, Y, Z, U, V, W, length=1, normalize=False, color = 'green', alpha = .7,arrow_length_ratio = np.linalg.norm(combo)/300, pivot = 'tail',
          linestyles = 'solid',linewidths = 3)
    
    #################################Plot Rectangle Boxes##############################
    point1 = [avec1[0, 3], avec1[0, 4], avec1[0, 5]]
    point2 = [avec1[0, 3]+bvec2[0, 3], avec1[0, 4]+bvec2[0, 4], avec1[0, 5]+bvec2[0, 5]]
    line1 = np.array([point1, point2])
    ax.plot(line1[:,0], line1[:,1], line1[:,2], lw =3, ls = '--', color = 'black', alpha=0.5)
    
    point1 = [bvec2[0, 3], bvec2[0, 4], bvec2[0, 5]]
    point2 = [avec1[0, 3]+bvec2[0, 3], avec1[0, 4]+bvec2[0, 4], avec1[0, 5]+bvec2[0, 5]]
    line1 = np.array([point1, point2])
    ax.plot(line1[:,0], line1[:,1], line1[:,2], lw =3, ls = '--', color = 'black', alpha=0.5)

    point1 = [bvec2[0, 3], bvec2[0, 4], bvec2[0, 5]]
    point2 = [cvec3[0, 3]+bvec2[0, 3], cvec3[0, 4]+bvec2[0, 4], cvec3[0, 5]+bvec2[0, 5]]
    line1 = np.array([point1, point2])
    ax.plot(line1[:,0], line1[:,1], line1[:,2], lw =3, ls = '--', color = 'black', alpha=0.5)

    point1 = [cvec3[0, 3], cvec3[0, 4], cvec3[0, 5]]
    point2 = [cvec3[0, 3]+bvec2[0, 3], cvec3[0, 4]+bvec2[0, 4], cvec3[0, 5]+bvec2[0, 5]]
    line1 = np.array([point1, point2])
    ax.plot(line1[:,0], line1[:,1], line1[:,2], lw =3, ls = '--', color = 'black', alpha=0.5)
    
    point1 = [cvec3[0, 3], cvec3[0, 4], cvec3[0, 5]]
    point2 = [cvec3[0, 3]+avec1[0, 3], cvec3[0, 4]+avec1[0, 4], cvec3[0, 5]+avec1[0, 5]]
    line1 = np.array([point1, point2])
    ax.plot(line1[:,0], line1[:,1], line1[:,2], lw =3, ls = '--', color = 'black', alpha=0.5)
    
    point1 = [avec1[0, 3], avec1[0, 4], avec1[0, 5]]
    point2 = [cvec3[0, 3]+avec1[0, 3], cvec3[0, 4]+avec1[0, 4], cvec3[0, 5]+avec1[0, 5]]
    line1 = np.array([point1, point2])
    ax.plot(line1[:,0], line1[:,1], line1[:,2], lw =3, ls = '--', color = 'black', alpha=0.5)
    
    ##
    point1 = [avec1[0, 3]+bvec2[0, 3]+cvec3[0, 3], 
              avec1[0, 4]+bvec2[0, 4]+cvec3[0, 4], 
              avec1[0, 5]+bvec2[0, 5]+cvec3[0, 5]]
    point2 = [cvec3[0, 3]+avec1[0, 3], 
              cvec3[0, 4]+avec1[0, 4], 
              cvec3[0, 5]+avec1[0, 5]]
    line1 = np.array([point1, point2])
    ax.plot(line1[:,0], line1[:,1], line1[:,2], lw =3, ls = '--', color = 'black', alpha=0.5)
    
    ##
    point1 = [avec1[0, 3]+bvec2[0, 3]+cvec3[0, 3],
              avec1[0, 4]+bvec2[0, 4]+cvec3[0, 4], 
              avec1[0, 5]+bvec2[0, 5]+cvec3[0, 5]]
    point2 = [cvec3[0, 3]+bvec2[0, 3], 
              cvec3[0, 4]+bvec2[0, 4], 
              cvec3[0, 5]+bvec2[0, 5]]
    line1 = np.array([point1, point2])
    ax.plot(line1[:,0], line1[:,1], line1[:,2], lw =3, ls = '--', color = 'black', alpha=0.5)
    
    ##
    point1 = [avec1[0, 3]+bvec2[0, 3]+cvec3[0, 3], 
              avec1[0, 4]+bvec2[0, 4]+cvec3[0, 4], 
              avec1[0, 5]+bvec2[0, 5]+cvec3[0, 5]]
    point2 = [bvec2[0, 3]+avec1[0, 3], 
              bvec2[0, 4]+avec1[0, 4], 
              bvec2[0, 5]+avec1[0, 5]]
    line1 = np.array([point1, point2])
    ax.plot(line1[:,0], line1[:,1], line1[:,2], lw =3, ls = '--', color = 'black', alpha=0.5)
    #################################Annotation########################################
    ax.text(x = vec1[0,3], y = vec1[0,4], z = vec1[0,5], s= ' $v_1 =(%0.d, %0.d, %.0d)$'% (vec1[0,3], vec1[0,4], vec1[0,4]), size = 8)
    ax.text(x = vec2[0,3], y = vec2[0,4], z = vec2[0,5], s= ' $v_2 =(%0.d, %0.d, %.0d)$'% (vec2[0,3], vec2[0,4], vec2[0,4]), size = 8)
    ax.text(x = vec3[0,3], y = vec3[0,4], z = vec3[0,5], s= ' $v_3= (%0.d, %0.d, %.0d)$'% (vec3[0,3], vec3[0,4], vec3[0,4]), size = 8)
    
    ax.text(x = avec1[0,3], y = avec1[0,4], z = avec1[0,5], s= ' $%.0d v_1 =(%0.d, %0.d, %.0d)$'% (a, avec1[0,3], avec1[0,4], avec1[0,4]), size = 8)
    ax.text(x = bvec2[0,3], y = bvec2[0,4], z = bvec2[0,5], s= ' $%.0d v_2 =(%0.d, %0.d, %.0d)$'% (b, bvec2[0,3], bvec2[0,4], bvec2[0,4]), size = 8)
    ax.text(x = cvec3[0,3], y = cvec3[0,4], z = cvec3[0,5], s= ' $%.0d v_3= (%0.d, %0.d, %.0d)$'% (c, cvec3[0,3], cvec3[0,4], cvec3[0,4]), size = 8)
#     ax.text(x = 0, y = b, z = 0, s= ' $%0.d e_2 = (0, %0.d, 0)$'% (b, b), size = 15)
#     ax.text(x = 0, y = 0, z = c, s= ' $%0.d e_3 = (0, 0, %0.d)$' %(c, c), size = 15)
    
    #################################Axis Setting######################################
    ax.grid()
    ax.set_xlim([0, 15])
    ax.set_ylim([0, 15])
    ax.set_zlim([0, 15])
    
    ax.set_xlabel('x-axis', size = 18)
    ax.set_ylabel('y-axis', size = 18)
    ax.set_zlabel('z-axis', size = 18)
    
    #ax.set_title('Vector $(%0.d, %0.d, %.0d)$ Visualization' %(a, b, c), size = 20)
    
    ax.view_init(elev=20., azim=15)

if __name__ == '__main__':
    a = 2
    b = 3
    c = 4
    vec1 = np.array([2,1,0])
    vec2 = np.array([0,3,1])
    vec3 = np.array([1,2,3])
    linearComboNonStd(a, b, c, vec1,vec2,vec3)

